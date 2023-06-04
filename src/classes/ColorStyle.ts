import {
  cyan,
  flash1Osrs,
  flash1Rs3,
  flash2Osrs,
  flash2Rs3,
  flash3Osrs,
  flash3Rs3,
  glow1Osrs,
  glow1Rs3,
  glow2Osrs,
  glow2Rs3,
  glow3Osrs,
  glow3Rs3,
  green,
  purple,
  red,
  white,
  yellow,
} from "../utils/effectUtil";

export default class ColorStyle {
  config: Config;
  color!: Color;
  colorFunction!: (() => number[]) | ((frame: number) => number[]);
  constructor(config: Config) {
    this.config = config;
  }

  getGlow(frame: number, glow: number[][]) {
    const inbetweenFrames = this.config.totalFrames / (glow.length - 1);

    const index = Math.floor(frame / inbetweenFrames);
    const currentColor = glow[index];
    const nextColor = glow[index + 1];

    const incrementFactor = (frame % inbetweenFrames) / inbetweenFrames;

    return currentColor.map(
      (color, index) =>
        color + Math.round((nextColor[index] - color) * incrementFactor)
    );
  }

  getFlash(frame: number, flash: number[][]) {
    return flash[
      Number(((2 * frame) % this.config.fps) * 2 >= this.config.fps)
    ];
  }

  setColor(color: Color) {
    const colorFunctionMap = {
      osrs: {
        cyan: () => cyan,
        flash1: (frame: number) => this.getFlash(frame, flash1Osrs),
        flash2: (frame: number) => this.getFlash(frame, flash2Osrs),
        flash3: (frame: number) => this.getFlash(frame, flash3Osrs),
        glow1: (frame: number) => this.getGlow(frame, glow1Osrs),
        glow2: (frame: number) => this.getGlow(frame, glow2Osrs),
        glow3: (frame: number) => this.getGlow(frame, glow3Osrs),
        green: () => green,
        purple: () => purple,
        red: () => red,
        white: () => white,
        yellow: () => yellow,
      },
      rs3: {
        cyan: () => cyan,
        flash1: (frame: number) => this.getFlash(frame, flash1Rs3),
        flash2: (frame: number) => this.getFlash(frame, flash2Rs3),
        flash3: (frame: number) => this.getFlash(frame, flash3Rs3),
        glow1: (frame: number) => this.getGlow(frame, glow1Rs3),
        glow2: (frame: number) => this.getGlow(frame, glow2Rs3),
        glow3: (frame: number) => this.getGlow(frame, glow3Rs3),
        green: () => green,
        purple: () => purple,
        red: () => red,
        white: () => white,
        yellow: () => yellow,
      },
    };

    this.color = color;
    this.colorFunction = colorFunctionMap[this.config.version][this.color];
  }

  calculate(frame: number) {
    return `rgba(${this.colorFunction(frame)}, 1)`;
  }
}
