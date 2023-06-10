import Context from "./Context";

export default class MotionEffect {
  private _config: Config;
  private _measureContext: Context;
  private _motion!: Motion;
  private _motionFunction!: (input: MotionFunctionInput) => Coordinates;
  constructor(config: Config) {
    this._config = config;
    this._measureContext = new Context(this._config);
  }

  get motion() {
    return this._motion;
  }

  get motionFunction() {
    return this._motionFunction;
  }

  setMotion(motion: Motion) {
    this._motion = motion;
    this._motionFunction = this.getMotionFunction();
  }

  private getMotionFunction() {
    switch (this.motion) {
      case "none":
        return this.renderNone;
      case "scroll":
        return this.renderScroll;
      case "shake":
      case "slide":
        return this._config.version === "osrs"
          ? (input: MotionFunctionInput) =>
              this.renderSlide(input, this.getSlideOsrs())
          : (input: MotionFunctionInput) =>
              this.renderSlide(input, this.getSlideRs3());
      case "wave":
      case "wave2":
        return this.renderNone;
    }
  }

  private renderNone({ line, lineCharacterIndex }: MotionFunctionInput) {
    const { width: x } = this._measureContext.measureText(
      line.slice(0, lineCharacterIndex)
    );
    const { ascent: y } = this._measureContext.measureText(line);

    return { x, y };
  }

  private renderScroll({
    frame,
    line,
    lineCharacterIndex,
  }: MotionFunctionInput) {
    const { ascent: y, width: lineWidth } =
      this._measureContext.measureText(line);
    const { width } = this._measureContext.measureText(
      line.slice(0, lineCharacterIndex)
    );
    const displacement = Math.round(
      (1 - (2 * frame) / this._config.totalFrames) * lineWidth
    );
    const x = width + displacement;

    return { x, y };
  }

  private renderSlide(
    { frame, line, lineCharacterIndex }: MotionFunctionInput,
    getY: (
      ascent: number,
      frame: number,
      motionFrameIndex: number,
      height: number
    ) => number
  ) {
    const { width: x } = this._measureContext.measureText(
      line.slice(0, lineCharacterIndex)
    );
    const { ascent, height } = this._measureContext.measureText(line);
    const motionFrameIndex = Math.round(this._config.totalFrames / 6);
    const y = getY(ascent, frame, motionFrameIndex, height);

    return { x, y };
  }

  private getSlideOsrs() {
    return (
      ascent: number,
      frame: number,
      motionFrameIndex: number,
      height: number
    ) => {
      let displacement = ascent;
      if (frame < motionFrameIndex) {
        displacement -=
          ((motionFrameIndex - frame) / motionFrameIndex) * height;
      } else if (frame > this._config.totalFrames - motionFrameIndex) {
        displacement -=
          ((this._config.totalFrames - motionFrameIndex - frame) /
            motionFrameIndex) *
          height;
      }

      return Math.round(displacement);
    };
  }

  private getSlideRs3() {
    return (
      ascent: number,
      frame: number,
      motionFrameIndex: number,
      height: number
    ) => {
      let displacement = ascent;
      if (frame < motionFrameIndex) {
        displacement +=
          ((motionFrameIndex - frame) / motionFrameIndex) * height;
      } else if (frame > this._config.totalFrames - motionFrameIndex) {
        displacement +=
          ((this._config.totalFrames - motionFrameIndex - frame) /
            motionFrameIndex) *
          height;
      }

      return Math.round(displacement);
    };
  }
}
