const GifEncoder = require("gif-encoder");

class Encoder {
  constructor(contexts, config) {
    this.contexts = contexts;
    this.config = config;
  }

  encodePng() {
    return this.contexts[0].canvas.toBuffer("image/png");
  }

  encodeGif(width, height) {
    const gif = new GifEncoder(width, height);

    gif.setRepeat(0);
    gif.setQuality(this.config.quality);
    gif.setDelay(this.config.delayPerFrame);
    gif.setTransparent(0x808080);
    gif.writeHeader();

    const frames = [];
    const buffer = new Promise((resolve, reject) => {
      gif.on("data", (data) => frames.push(data));
      gif.on("end", () => resolve(Buffer.concat(frames)));
      gif.on("error", reject);
    });

    this.contexts
      .map((context) => context.getImageData(0, 0, width, height).data)
      .forEach((pixels) => gif.addFrame(pixels));

    gif.finish();

    return buffer;
  }

  encodeImage() {
    const { width, height } = this.contexts[0].canvas;

    return this.contexts.length === 1
      ? {
          buffer: this.encodePng(),
          extension: "png",
          width,
          height,
        }
      : {
          buffer: this.encodeGif(width, height),
          extension: "gif",
          width,
          height,
        };
  }
}

module.exports = Encoder;
