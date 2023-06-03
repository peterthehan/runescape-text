import { CanvasRenderingContext2D } from "canvas";

import { isAnimated } from "../utils/effectUtil";
import range from "../utils/range";
import Color from "./ColorStyle";
import { Context, measureText } from "./Context";

export default class MotionStyle {
  config: Config;
  motion!: Motion;
  motionFunction!: (line: string, color: Color) => CanvasRenderingContext2D[];
  constructor(config: Config) {
    this.config = config;
  }

  renderNoneStatic(message: string, color: Color) {
    const { width, height, ascent } = measureText(message, this.config.scale);

    const context = new Context(width, height, this.config.scale).getStatic();
    context.fillStyle = color.calculate(0);

    context.fillText(message, 0, ascent);

    return [context];
  }

  renderNoneDynamic(line: string, color: Color) {
    const { width, height, ascent } = measureText(line, this.config.scale);

    return range(this.config.totalFrames).map((frame) => {
      const context = new Context(
        width,
        height,
        this.config.scale
      ).getDynamic();
      context.fillStyle = color.calculate(frame);

      context.fillText(line, 0, ascent);

      return context;
    });
  }

  getWave() {
    return {
      amplitudeFactor: 1 / 3,
      getTotalWidth: (width: number) => width,
      frameFactor: 1,
      getWave: (wave: number) => 1 + wave,
      getX: (width: number) => width,
    };
  }

  getWave2() {
    return {
      amplitudeFactor: 1 / 6,
      getTotalWidth: (width: number, amplitude: number) =>
        Math.round(width + 2 * amplitude),
      frameFactor: 1,
      getWave: (wave: number) => 1 + wave,
      getX: (width: number, displacement: number) =>
        Math.round(width + displacement),
    };
  }

  getShake() {
    return {
      amplitudeFactor: 1 / 3,
      getTotalWidth: (width: number) => width,
      frameFactor: 6,
      getWave: (wave: number, frame: number) =>
        2 * frame > this.config.totalFrames
          ? 1
          : 1 + wave * (1 - (2 * frame) / this.config.totalFrames),
      getX: (width: number) => width,
    };
  }

  renderWave(
    line: string,
    color: Color,
    {
      amplitudeFactor,
      getTotalWidth,
      frameFactor,
      getWave,
      getX,
    }: {
      amplitudeFactor: number;
      frameFactor: number;
      getTotalWidth:
        | ((width: number) => number)
        | ((width: number, amplitude: number) => number);
      getWave: (wave: number, frame: number) => number;
      getX:
        | ((width: number) => number)
        | ((width: number, displacement: number) => number);
    }
  ) {
    const { width, height, ascent } = measureText(line, this.config.scale);

    const amplitude = height * amplitudeFactor;
    const totalWidth = getTotalWidth(width, amplitude);
    const totalHeight = Math.round(height + 2 * amplitude);

    return range(this.config.totalFrames).map((frame) => {
      const context = new Context(
        totalWidth,
        totalHeight,
        this.config.scale
      ).getDynamic();
      context.fillStyle = color.calculate(frame);

      line.split("").forEach((char, index) => {
        const wave = Math.sin(
          Math.PI *
            (index / 6 + 8 * frameFactor * (frame / this.config.totalFrames))
        );
        const displacement = amplitude * getWave(wave, frame);
        const x = getX(
          measureText(line.slice(0, index), this.config.scale).width,
          displacement
        );
        const y = Math.round(ascent + displacement);

        context.fillText(char, x, y);
      });

      return context;
    });
  }

  renderScroll(line: string, color: Color) {
    const { width, height, ascent } = measureText(line, this.config.scale);

    return range(this.config.totalFrames).map((frame) => {
      const context = new Context(
        width,
        height,
        this.config.scale
      ).getDynamic();
      context.fillStyle = color.calculate(frame);

      const displacement =
        width - ((2 * frame) / this.config.totalFrames) * width;

      context.fillText(line, Math.round(displacement), ascent);

      return context;
    });
  }

  getSlideOsrs() {
    return {
      getY: (
        ascent: number,
        frame: number,
        motionFrameIndex: number,
        height: number
      ) => {
        let displacement = ascent;
        if (frame < motionFrameIndex) {
          displacement -=
            ((motionFrameIndex - frame) / motionFrameIndex) * height;
        } else if (frame > this.config.totalFrames - motionFrameIndex) {
          displacement -=
            ((this.config.totalFrames - motionFrameIndex - frame) /
              motionFrameIndex) *
            height;
        }

        return Math.round(displacement);
      },
    };
  }

  getSlideRs3() {
    return {
      getY: (
        ascent: number,
        frame: number,
        motionFrameIndex: number,
        height: number
      ) => {
        let displacement = ascent;
        if (frame < motionFrameIndex) {
          displacement +=
            ((motionFrameIndex - frame) / motionFrameIndex) * height;
        } else if (frame > this.config.totalFrames - motionFrameIndex) {
          displacement +=
            ((this.config.totalFrames - motionFrameIndex - frame) /
              motionFrameIndex) *
            height;
        }

        return Math.round(displacement);
      },
    };
  }

  renderSlide(
    line: string,
    color: Color,
    {
      getY,
    }: {
      getY: (
        ascent: number,
        frame: number,
        motionFrameIndex: number,
        height: number
      ) => number;
    }
  ) {
    const { width, height, ascent } = measureText(line, this.config.scale);
    const motionFrameIndex = Math.round(this.config.totalFrames / 6);

    return range(this.config.totalFrames).map((frame) => {
      const context = new Context(
        width,
        height,
        this.config.scale
      ).getDynamic();
      context.fillStyle = color.calculate(frame);

      context.fillText(line, 0, getY(ascent, frame, motionFrameIndex, height));

      return context;
    });
  }

  mergeContexts(
    mergedContexts: CanvasRenderingContext2D[],
    contexts: CanvasRenderingContext2D[]
  ) {
    if (mergedContexts.length === 0) {
      return contexts;
    }

    const maxWidth = Math.max(
      mergedContexts[0].canvas.width,
      contexts[0].canvas.width
    );
    const totalHeight =
      mergedContexts[0].canvas.height + contexts[0].canvas.height;

    return mergedContexts.map((context, index) => {
      const newContext = new Context(
        maxWidth,
        totalHeight,
        this.config.scale
      ).getMerge();

      newContext.drawImage(context.canvas, 0, 0);
      newContext.drawImage(contexts[index].canvas, 0, context.canvas.height);

      return newContext;
    });
  }

  setMotion(motion: Motion) {
    const motionFunctionMap = {
      [Version.Osrs]: {
        [Motion.None]: this.renderNoneDynamic,
        [Motion.Wave]: (line: string, color: Color) =>
          this.renderWave(line, color, this.getWave()),
        [Motion.Wave2]: (line: string, color: Color) =>
          this.renderWave(line, color, this.getWave2()),
        [Motion.Shake]: (line: string, color: Color) =>
          this.renderWave(line, color, this.getShake()),
        [Motion.Scroll]: this.renderScroll,
        [Motion.Slide]: (line: string, color: Color) =>
          this.renderSlide(line, color, this.getSlideOsrs()),
      },
      [Version.Rs3]: {
        [Motion.None]: this.renderNoneDynamic,
        [Motion.Wave]: (line: string, color: Color) =>
          this.renderWave(line, color, this.getWave()),
        [Motion.Wave2]: (line: string, color: Color) =>
          this.renderWave(line, color, this.getWave2()),
        [Motion.Shake]: (line: string, color: Color) =>
          this.renderWave(line, color, this.getShake()),
        [Motion.Scroll]: this.renderScroll,
        [Motion.Slide]: (line: string, color: Color) =>
          this.renderSlide(line, color, this.getSlideRs3()),
      },
    };

    this.motion = motion;
    this.motionFunction = motionFunctionMap[this.config.version][this.motion];
  }

  render(message: string, color: Color) {
    if (!isAnimated(color.color, this.motion)) {
      return this.renderNoneStatic(message, color);
    }

    return message
      .split("\n")
      .reduce((mergedContexts: CanvasRenderingContext2D[], line) => {
        const contexts = this.motionFunction(line, color);
        return this.mergeContexts(mergedContexts, contexts);
      }, []);
  }
}
