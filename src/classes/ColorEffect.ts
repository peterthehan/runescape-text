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

export default class ColorEffect {
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
    this._color = color;
    this.colorFunction = this.getColorFunction(pattern, message);
  }

  calculate(input: ColorFunctionInput) {
    return `rgba(${this.colorFunction(input)}, 1)`;
  }

  private getColorFunction(
    pattern: [] | NonEmptyArray<PatternCharacter>,
    message: string
  ) {
    switch (this.color) {
      case "cyan":
        return () => CYAN;
      case "flash1":
        return this.config.version === "osrs"
          ? (input: ColorFunctionInput) => this.getFlash(input, FLASH_1_OSRS)
          : (input: ColorFunctionInput) => this.getFlash(input, FLASH_1_RS3);
      case "flash2":
        return this.config.version === "osrs"
          ? (input: ColorFunctionInput) => this.getFlash(input, FLASH_2_OSRS)
          : (input: ColorFunctionInput) => this.getFlash(input, FLASH_2_RS3);
      case "flash3":
        return this.config.version === "osrs"
          ? (input: ColorFunctionInput) => this.getFlash(input, FLASH_3_OSRS)
          : (input: ColorFunctionInput) => this.getFlash(input, FLASH_3_RS3);
      case "glow1":
        return this.config.version === "osrs"
          ? (input: ColorFunctionInput) => this.getGlow(input, GLOW_1_OSRS)
          : (input: ColorFunctionInput) => this.getGlow(input, GLOW_1_RS3);
      case "glow2":
        return this.config.version === "osrs"
          ? (input: ColorFunctionInput) => this.getGlow(input, GLOW_2_OSRS)
          : (input: ColorFunctionInput) => this.getGlow(input, GLOW_2_RS3);
      case "glow3":
        return this.config.version === "osrs"
          ? (input: ColorFunctionInput) => this.getGlow(input, GLOW_3_OSRS)
          : (input: ColorFunctionInput) => this.getGlow(input, GLOW_3_RS3);
      case "green":
        return () => GREEN;
      case "pattern": {
        const patternColors = this.createPatternColors(pattern, message);
        return (input: ColorFunctionInput) =>
          this.getPattern(input, patternColors);
      }
      case "purple":
        return () => PURPLE;
      case "rainbow": {
        const rainbowColors = this.createRainbowColors(message);
        return (input: ColorFunctionInput) =>
          this.getPattern(input, rainbowColors);
      }
      case "red":
        return () => RED;
      case "white":
        return () => WHITE;
      case "yellow":
        return () => YELLOW;
    }
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

  private createRainbowColors(message: string) {
    return this.createPatternColors(
      ["1", "3", "4", "f", "v", "7", "1"],
      message
    );
  }

  private createPatternBuckets(patternLength: number, messageLength: number) {
    const baseBucketSize = Math.floor(messageLength / patternLength);
    const buckets = [...Array(patternLength).keys()].fill(baseBucketSize);
    const remainder = messageLength % patternLength;
    const increment = Math.floor(patternLength / remainder);

    for (let i = 0; i < remainder; ++i) {
      const index = i * increment;
      ++buckets[index];
    }

    return buckets;
  }
}
