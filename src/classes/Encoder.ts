import { CanvasRenderingContext2D } from "canvas";
import { applyPalette, GIFEncoder, quantize } from "gifenc";

const MAX_COLORS = 256;

export default class Encoder {
  private config: Config;
  constructor(config: Config) {
    this.config = config;
  }

  encode(contexts: CanvasRenderingContext2D[]) {
    const { width, height } = contexts[0].canvas;
    return {
      buffer: this.encodeGif(contexts, width, height),
      extension: "gif",
      framesCount: contexts.length,
      height,
      width,
    };
  }

  private encodeGif(
    contexts: CanvasRenderingContext2D[],
    width: number,
    height: number
  ) {
    const gif = GIFEncoder();

    contexts.forEach((context) => {
      const data = context.getImageData(0, 0, width, height).data;
      const palette = quantize(data, MAX_COLORS, {
        format: this.config.format,
      });
      const index = applyPalette(data, palette, this.config.format);

      gif.writeFrame(index, width, height, {
        delay: this.config.delayPerFrame,
        palette,
        transparent: true,
      });
    });

    gif.finish();

    return gif.bytesView();
  }
}
