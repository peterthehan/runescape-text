const { Context, measureText } = require("./Context");
const { isAnimated } = require("../utils/effectUtil");
const range = require("../utils/range");

class Motion {
  constructor(config) {
    this.version = config.version;
    this.scale = config.scale;
    this.totalFrames = config.totalFrames;
  }

  renderNoneStatic(message, color) {
    const { width, height, ascent } = measureText(message, this.scale);

    const context = new Context(width, height, this.scale).getStatic();
    context.fillStyle = color.calculate(0);

    context.fillText(message, 0, ascent);

    return [context];
  }

  renderNoneDynamic(line, color) {
    const { width, height, ascent } = measureText(line, this.scale);

    return range(this.totalFrames).map((frame) => {
      const context = new Context(width, height, this.scale).getDynamic();
      context.fillStyle = color.calculate(frame);

      context.fillText(line, 0, ascent);

      return context;
    });
  }

  getWave() {
    return {
      amplitudeFactor: 1 / 3,
      getTotalWidth: (width) => width,
      frameFactor: 1,
      getWave: (wave) => 1 + wave,
      getX: (width) => width,
    };
  }

  getWave2() {
    return {
      amplitudeFactor: 1 / 6,
      getTotalWidth: (width, amplitude) => Math.round(width + 2 * amplitude),
      frameFactor: 1,
      getWave: (wave) => 1 + wave,
      getX: (width, displacement) => Math.round(width + displacement),
    };
  }

  getShake() {
    return {
      amplitudeFactor: 1 / 3,
      getTotalWidth: (width) => width,
      frameFactor: 6,
      getWave: (wave, frame) =>
        2 * frame > this.totalFrames
          ? 1
          : 1 + wave * (1 - (2 * frame) / this.totalFrames),
      getX: (width) => width,
    };
  }

  renderWave(
    line,
    color,
    { amplitudeFactor, getTotalWidth, frameFactor, getWave, getX }
  ) {
    const { width, height, ascent } = measureText(line, this.scale);

    const amplitude = height * amplitudeFactor;
    const totalWidth = getTotalWidth(width, amplitude);
    const totalHeight = Math.round(height + 2 * amplitude);

    return range(this.totalFrames).map((frame) => {
      const context = new Context(
        totalWidth,
        totalHeight,
        this.scale
      ).getDynamic();
      context.fillStyle = color.calculate(frame);

      line.split("").forEach((char, index) => {
        const wave = Math.sin(
          Math.PI * (index / 6 + 8 * frameFactor * (frame / this.totalFrames))
        );
        const displacement = amplitude * getWave(wave, frame);
        const x = getX(
          measureText(line.slice(0, index), this.scale).width,
          displacement
        );
        const y = Math.round(ascent + displacement);

        context.fillText(char, x, y);
      });

      return context;
    });
  }

  renderScroll(line, color) {
    const { width, height, ascent } = measureText(line, this.scale);

    return range(this.totalFrames).map((frame) => {
      const context = new Context(width, height, this.scale).getDynamic();
      context.fillStyle = color.calculate(frame);

      const displacement = width - ((2 * frame) / this.totalFrames) * width;

      context.fillText(line, Math.round(displacement), ascent);

      return context;
    });
  }

  getSlideOsrs() {
    return {
      getY: (ascent, frame, motionFrameIndex, height) => {
        let displacement = ascent;
        if (frame < motionFrameIndex) {
          displacement -=
            ((motionFrameIndex - frame) / motionFrameIndex) * height;
        } else if (frame > this.totalFrames - motionFrameIndex) {
          displacement -=
            ((this.totalFrames - motionFrameIndex - frame) / motionFrameIndex) *
            height;
        }

        return Math.round(displacement);
      },
    };
  }

  getSlideRs3() {
    return {
      getY: (ascent, frame, motionFrameIndex, height) => {
        let displacement = ascent;
        if (frame < motionFrameIndex) {
          displacement +=
            ((motionFrameIndex - frame) / motionFrameIndex) * height;
        } else if (frame > this.totalFrames - motionFrameIndex) {
          displacement +=
            ((this.totalFrames - motionFrameIndex - frame) / motionFrameIndex) *
            height;
        }

        return Math.round(displacement);
      },
    };
  }

  renderSlide(line, color, { getY }) {
    const { width, height, ascent } = measureText(line, this.scale);
    const motionFrameIndex = Math.round(this.totalFrames / 6);

    return range(this.totalFrames).map((frame) => {
      const context = new Context(width, height, this.scale).getDynamic();
      context.fillStyle = color.calculate(frame);

      context.fillText(line, 0, getY(ascent, frame, motionFrameIndex, height));

      return context;
    });
  }

  mergeContexts(mergedContexts, contexts) {
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
        this.scale
      ).getMerge();

      newContext.drawImage(context.canvas, 0, 0);
      newContext.drawImage(contexts[index].canvas, 0, context.canvas.height);

      return newContext;
    });
  }

  setMotion(motion) {
    const motionFunctionMap = {
      osrs: {
        none: this.renderNoneDynamic,
        wave: (line, color) => this.renderWave(line, color, this.getWave()),
        wave2: (line, color) => this.renderWave(line, color, this.getWave2()),
        shake: (line, color) => this.renderWave(line, color, this.getShake()),
        scroll: this.renderScroll,
        slide: (line, color) =>
          this.renderSlide(line, color, this.getSlideOsrs()),
      },
      rs3: {
        none: this.renderNoneDynamic,
        wave: (line, color) => this.renderWave(line, color, this.getWave()),
        wave2: (line, color) => this.renderWave(line, color, this.getWave2()),
        shake: (line, color) => this.renderWave(line, color, this.getShake()),
        scroll: this.renderScroll,
        slide: (line, color) =>
          this.renderSlide(line, color, this.getSlideRs3()),
      },
    };

    this.motion = motion;
    this.motionFunction = motionFunctionMap[this.version][this.motion];
  }

  render(message, color) {
    if (!isAnimated(color.color, this.motion)) {
      return this.renderNoneStatic(message, color);
    }

    return message.split("\n").reduce((mergedContexts, line) => {
      const contexts = this.motionFunction(line, color);
      return this.mergeContexts(mergedContexts, contexts);
    }, []);
  }
}

module.exports = Motion;
