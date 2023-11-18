import {
  Config,
  Coordinates,
  Motion,
  MotionFunctionInput,
  SlideInput,
  WaveInput,
} from "../types";
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
        return (input: MotionFunctionInput) =>
          this.renderWave(input, this.getShake());
      case "slide":
        return this._config.version === "osrs"
          ? (input: MotionFunctionInput) =>
              this.renderSlide(input, this.getSlideOsrs())
          : (input: MotionFunctionInput) =>
              this.renderSlide(input, this.getSlideRs3());
      case "wave":
        return (input: MotionFunctionInput) =>
          this.renderWave(input, this.getWave());
      case "wave2":
        return (input: MotionFunctionInput) =>
          this.renderWave(input, this.getWave2());
    }
  }

  private renderNone({ fragment, lineCharacterIndex }: MotionFunctionInput) {
    const { width: x } = this._measureContext.measureText(
      fragment.slice(0, lineCharacterIndex),
    );
    const { ascent: y } = this._measureContext.measureText(fragment);

    return { x, y };
  }

  private renderScroll({
    fragment,
    frame,
    lineCharacterIndex,
  }: MotionFunctionInput) {
    const { ascent: y, width: lineWidth } =
      this._measureContext.measureText(fragment);
    const { width } = this._measureContext.measureText(
      fragment.slice(0, lineCharacterIndex),
    );

    const displacement = Math.round(
      (1 - (2 * frame) / this._config.totalFrames) * lineWidth,
    );
    const x = width + displacement;

    return { x, y };
  }

  private renderSlide(
    { fragment, frame, lineCharacterIndex }: MotionFunctionInput,
    { getY }: SlideInput,
  ) {
    const { width: x } = this._measureContext.measureText(
      fragment.slice(0, lineCharacterIndex),
    );
    const { ascent, height } = this._measureContext.measureText(fragment);

    const motionFrameIndex = Math.round(this._config.totalFrames / 6);
    const y = getY({ ascent, frame, height, motionFrameIndex });

    return { x, y };
  }

  private renderWave(
    { fragment, frame, lineCharacterIndex }: MotionFunctionInput,
    { amplitudeFactor, frameFactor, getWave, getX }: WaveInput,
  ) {
    const { ascent, height } = this._measureContext.measureText(fragment);
    const { width } = this._measureContext.measureText(
      fragment.slice(0, lineCharacterIndex),
    );

    const amplitude = height * amplitudeFactor;
    const wave = Math.sin(
      Math.PI *
        (lineCharacterIndex / 6 +
          8 * frameFactor * (frame / this._config.totalFrames)),
    );
    const displacement = amplitude * getWave({ frame, wave });

    const x = getX({ displacement, width });
    const y = Math.round(ascent + displacement);

    return { x, y };
  }

  private getSlideOsrs(): SlideInput {
    return {
      getY: ({ ascent, frame, height, motionFrameIndex }) => {
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
      },
    };
  }

  private getSlideRs3(): SlideInput {
    return {
      getY: ({ ascent, frame, height, motionFrameIndex }) => {
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
      },
    };
  }

  private getShake(): WaveInput {
    return {
      amplitudeFactor: 1 / 3,
      frameFactor: 6,
      getWave: ({ frame, wave }) =>
        2 * frame > this._config.totalFrames
          ? 1
          : 1 + wave * (1 - (2 * frame) / this._config.totalFrames),
      getX: ({ width }) => width,
    };
  }

  private getWave(): WaveInput {
    return {
      amplitudeFactor: 1 / 3,
      frameFactor: 1,
      getWave: ({ wave }) => 1 + wave,
      getX: ({ width }) => width,
    };
  }

  private getWave2(): WaveInput {
    return {
      amplitudeFactor: 1 / 6,
      frameFactor: 1,
      getWave: ({ wave }) => 1 + wave,
      getX: ({ displacement, width }) => Math.round(width + displacement),
    };
  }
}
