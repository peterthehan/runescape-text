import {
  CYAN,
  FLASH_1_OSRS,
  FLASH_1_RS3,
  FLASH_2_OSRS,
  FLASH_2_RS3,
  FLASH_3_OSRS,
  FLASH_3_RS3,
  GLOW_1_OSRS,
  GLOW_1_RS3,
  GLOW_2_OSRS,
  GLOW_2_RS3,
  GLOW_3_OSRS,
  GLOW_3_RS3,
  GREEN,
  patternCharacterToColorMap,
  PURPLE,
  RED,
  WHITE,
  YELLOW,
} from "../utils/ColorUtil";

export default class ColorStyle {
  private config: Config;
  private _color!: Color | Pattern;
  private colorFunction!: (input: ColorFunctionInput) => number[];
  constructor(config: Config) {
    this.config = config;
  }

  get color() {
    return this._color;
  }

  setColor(
    color: Color | Pattern,
    pattern: [] | NonEmptyArray<PatternCharacter>,
    message: string
  ) {
    const patternColors = this.createPatternColors(pattern, message);

    const colorFunctionMap = {
      osrs: {
        cyan: () => CYAN,
        flash1: (input: ColorFunctionInput) =>
          this.getFlash(input, FLASH_1_OSRS),
        flash2: (input: ColorFunctionInput) =>
          this.getFlash(input, FLASH_2_OSRS),
        flash3: (input: ColorFunctionInput) =>
          this.getFlash(input, FLASH_3_OSRS),
        glow1: (input: ColorFunctionInput) => this.getGlow(input, GLOW_1_OSRS),
        glow2: (input: ColorFunctionInput) => this.getGlow(input, GLOW_2_OSRS),
        glow3: (input: ColorFunctionInput) => this.getGlow(input, GLOW_3_OSRS),
        green: () => GREEN,
        pattern: (input: ColorFunctionInput) =>
          this.getPattern(input, patternColors),
        purple: () => PURPLE,
        red: () => RED,
        white: () => WHITE,
        yellow: () => YELLOW,
      },
      rs3: {
        cyan: () => CYAN,
        flash1: (input: ColorFunctionInput) =>
          this.getFlash(input, FLASH_1_RS3),
        flash2: (input: ColorFunctionInput) =>
          this.getFlash(input, FLASH_2_RS3),
        flash3: (input: ColorFunctionInput) =>
          this.getFlash(input, FLASH_3_RS3),
        glow1: (input: ColorFunctionInput) => this.getGlow(input, GLOW_1_RS3),
        glow2: (input: ColorFunctionInput) => this.getGlow(input, GLOW_2_RS3),
        glow3: (input: ColorFunctionInput) => this.getGlow(input, GLOW_3_RS3),
        green: () => GREEN,
        pattern: (input: ColorFunctionInput) =>
          this.getPattern(input, patternColors),
        purple: () => PURPLE,
        red: () => RED,
        white: () => WHITE,
        yellow: () => YELLOW,
      },
    };

    this._color = color;
    this.colorFunction = colorFunctionMap[this.config.version][this.color];
  }

  calculate(input: ColorFunctionInput) {
    return `rgba(${this.colorFunction(input)}, 1)`;
  }

  private getFlash({ frame }: ColorFunctionInput, flash: number[][]) {
    return flash[
      Number(((2 * frame) % this.config.fps) * 2 >= this.config.fps)
    ];
  }

  private getGlow({ frame }: ColorFunctionInput, glow: number[][]) {
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

  private getPattern({ index }: ColorFunctionInput, pattern: number[][]) {
    return pattern[index];
  }

  private createPatternColors(
    pattern: [] | NonEmptyArray<PatternCharacter>,
    message: string
  ) {
    const buckets = this.createPatternBuckets(pattern.length, message.length);

    return pattern.flatMap((character, index) => {
      const output = [];
      for (let i = 0; i < buckets[index]; ++i) {
        output.push(patternCharacterToColorMap[character]);
      }

      return output;
    });
  }

  // naive implementation
  private createPatternBuckets(patternLength: number, messageLength: number) {
    const buckets = [];
    for (let i = 0; i < messageLength; ++i) {
      if (buckets.length < patternLength) {
        buckets.push(0);
      }

      ++buckets[i % patternLength];
    }

    return buckets;
  }
}
