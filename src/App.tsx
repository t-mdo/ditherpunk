import { useEffect, useRef } from "react";
import init, { add } from "../dither-wasm/pkg/dither_wasm";
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
      console.log(imageData);
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
