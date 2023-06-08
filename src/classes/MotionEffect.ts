import { CanvasRenderingContext2D } from "canvas";

import { isAnimated } from "../utils/EffectsUtil";
import range from "../utils/range";
import ColorEffect from "./ColorEffect";
import Context from "./Context";

type MotionFunctionInput = {
  character: string;
  color: ColorEffect;
  frame: number;
  line: string;
  lineCharacterIndex: number;
  lineContext: Context;
  messageCharacterIndex: number;
};

export default class MotionEffect {
  private config: Config;
  private measureContext: Context;
  private motion!: Motion;
  private motionFunction!: (input: MotionFunctionInput) => Context;
  constructor(config: Config) {
    this.config = config;
    this.measureContext = new Context(this.config);
  }

  setMotion(motion: Motion) {
    this.motion = motion;
    this.motionFunction = this.getMotionFunction();
  }

  render(message: string, color: ColorEffect) {
    const contexts: CanvasRenderingContext2D[] = [];

    const framesCount = isAnimated(color.color, this.motion)
      ? this.config.totalFrames
      : 1;

    for (const frame of range(framesCount)) {
      let messageCharacterIndex = 0;
      let messageContext = new Context(this.config).context;

      for (const line of message.split("\n")) {
        let lineCharacterIndex = 0;
        let lineContext = this.getLineContext(line);

        for (const character of line.split("")) {
          lineContext = this.motionFunction({
            character,
            color,
            frame,
            line,
            lineCharacterIndex,
            lineContext,
            messageCharacterIndex,
          });

          ++messageCharacterIndex;
          ++lineCharacterIndex;
        }

        messageContext = this.mergeContexts(
          messageContext,
          lineContext.context
        );
      }

      contexts.push(messageContext);
    }

    return contexts;
  }

  private getLineContext(line: string) {
    const { height, width } = this.getLineDimensions(line);

    return new Context(this.config, width, height).initialize();
  }

  private getLineDimensions(line: string) {
    const { height } = this.measureContext.measureText("\n");
    const { width } = this.measureContext.measureText(line);

    if (["none", "scroll", "slide"].includes(this.motion)) {
      return { height, width };
    }

    if (["shake", "wave"].includes(this.motion)) {
      const amplitude = height / 3;
      return { height: Math.round(height + 2 * amplitude), width };
    }

    const amplitude = height / 6;
    return {
      height: Math.round(height + 2 * amplitude),
      width: Math.round(width + 2 * amplitude),
    };
  }

  private getMotionFunction() {
    switch (this.motion) {
      case "none":
      case "scroll":
      case "shake":
      case "slide":
      case "wave":
      case "wave2":
        return this.renderNone;
    }
  }

  private renderNone({
    character,
    color,
    frame,
    line,
    lineCharacterIndex,
    lineContext,
    messageCharacterIndex,
  }: MotionFunctionInput) {
    const x = this.measureContext.measureText(
      line.slice(0, lineCharacterIndex)
    ).width;
    const y = this.measureContext.measureText(line).ascent;

    lineContext.context.fillStyle = color.calculate({
      frame,
      index: messageCharacterIndex,
    });
    lineContext.context.fillText(character, x, y);

    return lineContext;
  }

  private mergeContexts(
    messageContext: CanvasRenderingContext2D,
    lineContext: CanvasRenderingContext2D
  ) {
    if (messageContext.canvas.height === 0) {
      return lineContext;
    }

    const maxWidth = Math.max(
      messageContext.canvas.width,
      lineContext.canvas.width
    );
    const totalHeight =
      messageContext.canvas.height + lineContext.canvas.height;

    const newContext = new Context(this.config, maxWidth, totalHeight).context;
    newContext.drawImage(messageContext.canvas, 0, 0);
    newContext.drawImage(lineContext.canvas, 0, messageContext.canvas.height);

    return newContext;
  }
}
