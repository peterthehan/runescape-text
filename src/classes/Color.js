const {
  yellow,
  red,
  green,
  cyan,
  purple,
  white,
  glow1Rs3,
  glow2Rs3,
  glow3Rs3,
  flash1Rs3,
  flash2Rs3,
  flash3Rs3,
  glow1Osrs,
  glow2Osrs,
  glow3Osrs,
  flash1Osrs,
  flash2Osrs,
  flash3Osrs,
} = require("../utils/effectUtil");

class Color {
  constructor(config) {
    this.version = config.version;
    this.fps = config.fps;
    this.totalFrames = config.totalFrames;
  }

  getGlow(frame, glow) {
    const inbetweenFrames = this.totalFrames / (glow.length - 1);

    const index = Math.floor(frame / inbetweenFrames);
    const currentColor = glow[index];
    const nextColor = glow[index + 1];

    const incrementFactor = (frame % inbetweenFrames) / inbetweenFrames;

    return currentColor.map(
      (color, index) =>
        color + Math.round((nextColor[index] - color) * incrementFactor)
    );
  }

  getFlash(frame, flash) {
    return flash[Number(((2 * frame) % this.fps) * 2 >= this.fps)];
  }

  setColor(color) {
    const colorFunctionMap = {
      osrs: {
        yellow: () => yellow,
        red: () => red,
        green: () => green,
        cyan: () => cyan,
        purple: () => purple,
        white: () => white,
        glow1: (frame) => this.getGlow(frame, glow1Osrs),
        glow2: (frame) => this.getGlow(frame, glow2Osrs),
        glow3: (frame) => this.getGlow(frame, glow3Osrs),
        flash1: (frame) => this.getFlash(frame, flash1Osrs),
        flash2: (frame) => this.getFlash(frame, flash2Osrs),
        flash3: (frame) => this.getFlash(frame, flash3Osrs),
      },
      rs3: {
        yellow: () => yellow,
        red: () => red,
        green: () => green,
        cyan: () => cyan,
        purple: () => purple,
        white: () => white,
        glow1: (frame) => this.getGlow(frame, glow1Rs3),
        glow2: (frame) => this.getGlow(frame, glow2Rs3),
        glow3: (frame) => this.getGlow(frame, glow3Rs3),
        flash1: (frame) => this.getFlash(frame, flash1Rs3),
        flash2: (frame) => this.getFlash(frame, flash2Rs3),
        flash3: (frame) => this.getFlash(frame, flash3Rs3),
      },
    };

    this.color = color;
    this.colorFunction =
      this.version in colorFunctionMap &&
      this.color in colorFunctionMap[this.version]
        ? colorFunctionMap[this.version][this.color]
        : () => yellow;
  }

  calculate(frame) {
    return `rgba(${this.colorFunction(frame)}, 1)`;
  }
}

module.exports = Color;
