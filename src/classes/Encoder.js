const GifEncoder = require("gif-encoder");

class Encoder {
  constructor(config) {
    this.config = config;
  }

  encodePng(contexts) {
    return contexts[0].canvas.toBuffer("image/png");
  }

  encodeGif(contexts, width, height) {
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

    contexts
      .map((context) => context.getImageData(0, 0, width, height).data)
      .forEach((pixels) => gif.addFrame(pixels));

    gif.finish();

    return buffer;
  }

  encode(contexts) {
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

module.exports = Encoder;
