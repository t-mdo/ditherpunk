import { useEffect, useRef } from "react";
import init, { apply_dithering } from "../dither-wasm/pkg/dither_wasm";
import "./App.css";

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    init().then(() => {});
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];
    if (file) {
      loadImageToCanvas(file);
    }
  };

  const loadImageToCanvas = (file: File) => {
    const img = new Image();

    img.onload = () => {
      const canvas = canvasRef.current;

      if (!canvas) return;

      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;

      const grayscalePixels = new Uint8Array(canvas.width * canvas.height);
      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
        grayscalePixels[i / 4] = gray;
      }
      const ditheredPixels = apply_dithering(
        new Uint8Array(grayscalePixels),
        img.width,
        4,
      );
      const rgbaPixels = new Uint8Array(4 * canvas.width * canvas.height);
      for (let i = 0; i < pixels.length; i++) {
        const r = ditheredPixels[i];
        const g = ditheredPixels[i];
        const b = ditheredPixels[i];

        rgbaPixels[i * 4] = r;
        rgbaPixels[i * 4 + 1] = g;
        rgbaPixels[i * 4 + 2] = b;
        rgbaPixels[i * 4 + 3] = 255;
      }
      const newImageData = new ImageData(
        new Uint8ClampedArray(rgbaPixels),
        canvas.width,
        canvas.height,
      );
      ctx.putImageData(newImageData, 0, 0);
    };

    img.src = URL.createObjectURL(file);
  };

  return (
    <div className="flex flex-col gap-8">
      <input
        type="file"
        id="avatar"
        name="avatar"
        accept="image/png, image/jpeg"
        onChange={handleFileUpload}
      />
      <canvas ref={canvasRef} />
    </div>
  );
}

export default App;
