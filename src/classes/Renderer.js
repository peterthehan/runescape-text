const { Context, measureText } = require("./Context");
const {
  yellow,
  red,
  green,
  cyan,
  purple,
  white,
  lightGreen,
  darkGreen,
  blue,
  glow1,
  glow2,
  glow3,
  isAnimated,
} = require("../utils/effectUtil");
const range = require("../utils/range");

class Renderer {
  constructor(parsed, config) {
    this.color = parsed.color;
    this.motion = parsed.motion;
    this.message = parsed.message;
    this.scale = config.scale;
    this.fps = config.fps;
    this.totalFrames = config.totalFrames;
  }

  getColorFunction() {
    switch (this.color) {
      case "yellow":
        return () => yellow;
      case "red":
        return () => red;
      case "green":
        return () => green;
      case "cyan":
        return () => cyan;
      case "purple":
        return () => purple;
      case "white":
        return () => white;
      case "glow1":
        return (frame) => this.getGlow(frame, glow1);
      case "glow2":
        return (frame) => this.getGlow(frame, glow2);
      case "glow3":
        return (frame) => this.getGlow(frame, glow3);
      case "flash1":
        return (frame) => this.getFlash(frame, red, yellow);
      case "flash2":
        return (frame) => this.getFlash(frame, blue, cyan);
      case "flash3":
        return (frame) => this.getFlash(frame, darkGreen, lightGreen);
    }
  }

  getGlow(frame, glow) {
    const inbetweenFrames = this.totalFrames / (glow.length - 1);

    const index = Math.floor(frame / inbetweenFrames);
    const currentColor = glow[index];
    const nextColor = glow[index + 1];

    const incrementFactor = (frame % inbetweenFrames) / inbetweenFrames;

    return this.getInbetweenColor(currentColor, nextColor, incrementFactor);
  }

  getInbetweenColor(currentColor, nextColor, incrementFactor) {
    return currentColor.map(
      (color, index) =>
        color + Math.round((nextColor[index] - color) * incrementFactor)
    );
  }

  getFlash(frame, firstColor, secondColor) {
    return ((2 * frame) % this.fps) * 2 >= this.fps ? secondColor : firstColor;
  }

  getColor(frame) {
    const colorFunction = this.getColorFunction();
    return `rgba(${colorFunction(frame)}, 1)`;
  }

  renderNoneStatic() {
    const { width, height, actualBoundingBoxAscent } = measureText(
      this.message,
      this.scale
    );

    const context = new Context(width, height, this.scale).getStatic();
    context.fillStyle = this.getColor(0);

    context.fillText(this.message, 0, actualBoundingBoxAscent);

    return [context];
  }

  renderNoneDynamic(line) {
    const { width, height, actualBoundingBoxAscent } = measureText(
      line,
      this.scale
    );

    return range(this.totalFrames).map((frame) => {
      const context = new Context(width, height, this.scale).getDynamic();
      context.fillStyle = this.getColor(frame);

      context.fillText(line, 0, actualBoundingBoxAscent);

      return context;
    });
  }

  getWaveOptions() {
    return {
      amplitudeFactor: 1 / 3,
      getTotalWidth: (width) => width,
      frameFactor: 1,
      getWave: (wave) => 1 + wave,
      getX: (width) => width,
    };
  }

  getWave2Options() {
    return {
      amplitudeFactor: 1 / 6,
      getTotalWidth: (width, amplitude) => Math.round(width + 2 * amplitude),
      frameFactor: 1,
      getWave: (wave) => 1 + wave,
      getX: (width, displacement) => Math.round(width + displacement),
    };
  }

  getShakeOptions() {
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
    { amplitudeFactor, getTotalWidth, frameFactor, getWave, getX }
  ) {
    const { width, height, actualBoundingBoxAscent } = measureText(
      line,
      this.scale
    );

    const amplitude = height * amplitudeFactor;
    const totalWidth = getTotalWidth(width, amplitude);
    const totalHeight = Math.round(height + 2 * amplitude);

    return range(this.totalFrames).map((frame) => {
      const context = new Context(
        totalWidth,
        totalHeight,
        this.scale
      ).getDynamic();
      context.fillStyle = this.getColor(frame);

      line.split("").forEach((char, index) => {
        const wave = Math.sin(
          Math.PI * (index / 6 + 8 * frameFactor * (frame / this.totalFrames))
        );
        const displacement = amplitude * getWave(wave, frame);
        const x = getX(
          measureText(line.slice(0, index), this.scale).width,
          displacement
        );
        const y = Math.round(actualBoundingBoxAscent + displacement);

        context.fillText(char, x, y);
      });

      return context;
    });
  }

  renderScroll(line) {
    const { width, height, actualBoundingBoxAscent } = measureText(
      line,
      this.scale
    );

    return range(this.totalFrames).map((frame) => {
      const context = new Context(width, height, this.scale).getDynamic();
      context.fillStyle = this.getColor(frame);

      const displacement = width - ((2 * frame) / this.totalFrames) * width;

      context.fillText(line, Math.round(displacement), actualBoundingBoxAscent);

      return context;
    });
  }

  renderSlide(line) {
    const { width, height, actualBoundingBoxAscent } = measureText(
      line,
      this.scale
    );
    const motionFrameIndex = Math.round(this.totalFrames / 6);

    return range(this.totalFrames).map((frame) => {
      const context = new Context(width, height, this.scale).getDynamic();
      context.fillStyle = this.getColor(frame);

      let displacement = actualBoundingBoxAscent;
      if (frame < motionFrameIndex) {
        displacement +=
          ((motionFrameIndex - frame) / motionFrameIndex) * height;
      } else if (frame > this.totalFrames - motionFrameIndex) {
        displacement +=
          ((this.totalFrames - motionFrameIndex - frame) / motionFrameIndex) *
          height;
      }

      context.fillText(line, 0, Math.round(displacement));

      return context;
    });
  }

  getMotionFunction() {
    switch (this.motion) {
      case "none":
        return (line) => this.renderNoneDynamic(line);
      case "wave":
        return (line) => this.renderWave(line, this.getWaveOptions());
      case "wave2":
        return (line) => this.renderWave(line, this.getWave2Options());
      case "shake":
        return (line) => this.renderWave(line, this.getShakeOptions());
      case "scroll":
        return (line) => this.renderScroll(line);
      case "slide":
        return (line) => this.renderSlide(line);
    }
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

  renderContexts() {
    if (!isAnimated(this.color, this.motion)) {
      return this.renderNoneStatic();
    }

    const motionFunction = this.getMotionFunction();

    return this.message.split("\n").reduce((mergedContexts, line) => {
      const contexts = motionFunction(line);
      return this.mergeContexts(mergedContexts, contexts);
    }, []);
  }
}

module.exports = Renderer;
