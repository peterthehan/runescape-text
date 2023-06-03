import GifEncoder from "gif-encoder";
import { Buffer } from "node:buffer";
import { CanvasRenderingContext2D } from "canvas";

export default class Encoder {
  config: Config;
  constructor(config: Config) {
    this.config = config;
  }

  encodePng(contexts: CanvasRenderingContext2D[]) {
    const data = contexts[0].canvas
      .toDataURL()
      .replace(/^data:image\/\w+;base64,/, "");

    return Buffer.from(data, "base64");
  }

  encodeGif(
    contexts: CanvasRenderingContext2D[],
    width: number,
    height: number
  ) {
    const gif = new GifEncoder(width, height);

    gif.setRepeat(0);
    gif.setQuality(this.config.quality);
    gif.setDelay(this.config.delayPerFrame);
    gif.setTransparent(0x808080);
    gif.writeHeader();

    const frames: Buffer[] = [];
    const buffer = new Promise<Buffer>((resolve, reject) => {
      gif.on("data", (data) => frames.push(data));
      gif.on("end", () => resolve(Buffer.concat(frames)));
      gif.on("error", reject);
    });

    contexts
      .map((context) => context.getImageData(0, 0, width, height).data)
      .forEach((pixels) => gif.addFrame(pixels));

    gif.finish();

    return buffer;
  }

  encode(contexts: CanvasRenderingContext2D[]) {
    const { width, height } = contexts[0].canvas;

    return contexts.length === 1
      ? {
          width,
          height,
          extension: "png",
          buffer: this.encodePng(contexts),
        }
      : {
          width,
          height,
          extension: "gif",
          buffer: this.encodeGif(contexts, width, height),
        };
  }
}
