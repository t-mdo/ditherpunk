import { useEffect, useRef, useState } from "react";
import init, { wasm_apply_dithering } from "../dither-wasm/pkg/dither_wasm";
import { Slider } from "./components/ui/slider";
import { cn } from "./lib/utils";

type Image = {
  pixels: Uint8Array;
  height: number;
  width: number;
};

const matrixSizes = [2, 4, 8, 16, 32, 64];

function App() {
  const [image, setImage] = useState<Image>();
  const [matrixSizeIndex, setMatrixSizeIndex] = useState(2);
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

  const getGrayscalePixels = (
    pixels: ImageDataArray,
    width: number,
    height: number,
  ): Uint8Array => {
    const grayscalePixels = new Uint8Array(width * height);
    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
      grayscalePixels[i / 4] = gray;
    }
    return grayscalePixels;
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
      const pixels = getGrayscalePixels(
        imageData.data,
        canvas.width,
        canvas.height,
      );
      setImage({ pixels, width: canvas.width, height: canvas.height });
    };

    img.src = URL.createObjectURL(file);
  };

  useEffect(() => {
    if (!image) return;

    const ditheredPixels = wasm_apply_dithering(
      image.pixels,
      image.width,
      matrixSizes[matrixSizeIndex],
    );

    const rgbaPixels = new Uint8Array(4 * image.width * image.height);
    for (let i = 0; i < image.pixels.length; i++) {
      const pixel = ditheredPixels[i];

      rgbaPixels[i * 4] = pixel ? 255 : 0;
      rgbaPixels[i * 4 + 1] = pixel ? 255 : 0;
      rgbaPixels[i * 4 + 2] = pixel ? 255 : 0;
      rgbaPixels[i * 4 + 3] = 255;
    }
    const newImageData = new ImageData(
      new Uint8ClampedArray(rgbaPixels),
      image.width,
      image.height,
    );
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;

    ctx.putImageData(newImageData, 0, 0);
  }, [image, matrixSizeIndex]);

  return (
    <div
      className={cn(
        "dark flex h-screen w-screen justify-between bg-background text-foreground",
      )}
    >
      {image ? (
        <div className="flex w-72 shrink-0 flex-col items-center px-8 py-6">
          <div className="flex w-full flex-col items-center gap-2">
            Matrix size {matrixSizes[matrixSizeIndex]}
            <Slider
              value={[matrixSizeIndex]}
              onValueChange={([value]) => setMatrixSizeIndex(value)}
              onValueCommit={(value) => console.log(value)}
              min={0}
              max={matrixSizes.length - 1}
              step={1}
            />
          </div>
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <input
            type="file"
            id="avatar"
            name="avatar"
            accept="image/png, image/jpeg"
            onChange={handleFileUpload}
          />
        </div>
      )}
      <canvas className={cn({ hidden: !image })} ref={canvasRef} />
    </div>
  );
}

export default App;
