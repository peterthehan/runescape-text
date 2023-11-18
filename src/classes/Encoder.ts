import { CanvasRenderingContext2D } from "canvas";
import { applyPalette, GIFEncoder, quantize } from "gifenc";

import { Config, Extension } from "../types";

const MAX_COLORS = 256;

export default class Encoder {
  private _config: Config;
  constructor(config: Config) {
    this._config = config;
  }

  encode(contexts: CanvasRenderingContext2D[]) {
    const { height, width } = contexts[0].canvas;

    return {
      data: this.encodeGif(contexts, width, height),
      extension: "gif" as Extension,
      framesCount: contexts.length,
      height,
      width,
    };
  }

  private encodeGif(
    contexts: CanvasRenderingContext2D[],
    width: number,
    height: number,
  ) {
    const gif = GIFEncoder();

    contexts.forEach((context) => {
      const data = new Uint8Array(
        context.getImageData(0, 0, width, height).data,
      );
      const palette = quantize(data, MAX_COLORS, {
        format: this._config.format,
      });
      const index = applyPalette(data, palette, this._config.format);

      gif.writeFrame(index, width, height, {
        delay: this._config.delayPerFrame,
        palette,
        transparent: true,
      });
    });

    gif.finish();

    return gif.bytesView();
  }
}
