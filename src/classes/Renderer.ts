import { CanvasRenderingContext2D } from "canvas";

import {
  isAnimated,
  requiresProcessingPerCharacter,
  requiresProcessingPerLine,
} from "../utils/EffectsUtil";
import range from "../utils/range";
import ColorEffect from "./ColorEffect";
import Context from "./Context";
import MotionEffect from "./MotionEffect";

export default class Renderer {
  private _config: Config;
  private _measureContext: Context;
  private _colorEffect!: ColorEffect;
  private _motionEffect!: MotionEffect;
  constructor(config: Config) {
    this._config = config;
    this._measureContext = new Context(this._config);
  }

  setEffects(colorEffect: ColorEffect, motionEffect: MotionEffect) {
    this._colorEffect = colorEffect;
    this._motionEffect = motionEffect;
  }

  render(message: string) {
    const contexts: CanvasRenderingContext2D[] = [];

    const framesCount = isAnimated(
      this._colorEffect.color,
      this._motionEffect.motion
    )
      ? this._config.totalFrames
      : 1;
    const processPerLine = requiresProcessingPerLine(
      this._colorEffect.color,
      this._motionEffect.motion
    );
    const processPerCharacter = requiresProcessingPerCharacter(
      this._colorEffect.color,
      this._motionEffect.motion
    );

    for (const frame of range(framesCount)) {
      if (!processPerLine) {
        const messageContext = this.getContext(message);
        this.renderFrame({ context: messageContext, fragment: message, frame });
        contexts.push(messageContext.context);
        continue;
      }

      let messageCharacterIndex = 0;
      let messageContext = new Context(this._config);

      for (const line of message.split("\n")) {
        const lineContext = this.getContext(line);

        if (!processPerCharacter) {
          this.renderFrame({ context: lineContext, fragment: line, frame });
          messageContext = this.mergeContexts(messageContext, lineContext);
          continue;
        }

        let lineCharacterIndex = 0;

        for (const character of line.split("")) {
          this.renderFrame({
            character,
            context: lineContext,
            fragment: line,
            frame,
            index: messageCharacterIndex,
            lineCharacterIndex,
          });

          ++messageCharacterIndex;
          ++lineCharacterIndex;
        }

        messageContext = this.mergeContexts(messageContext, lineContext);
      }

      contexts.push(messageContext.context);
    }

    return contexts;
  }

  private renderFrame({
    character,
    context,
    fragment,
    frame,
    index = 0,
    lineCharacterIndex = 0,
  }: RenderInput) {
    const { x, y } = this._motionEffect.motionFunction({
      fragment,
      frame,
      lineCharacterIndex,
    });

    context.fill({
      colorEffect: this._colorEffect,
      fragment: character ?? fragment,
      frame,
      index,
      x,
      y,
    });
  }

  private getContext(line: string) {
    const { height, width } = this.getDimensions(line);

    return new Context(this._config, width, height).initialize();
  }

  private getDimensions(line: string) {
    const { height, width } = this._measureContext.measureText(line);

    if (["none", "scroll", "slide"].includes(this._motionEffect.motion)) {
      return { height, width };
    }

    if (["shake", "wave"].includes(this._motionEffect.motion)) {
      const amplitude = height / 3;
      return { height: Math.round(height + 2 * amplitude), width };
    }

    const amplitude = height / 6;
    return {
      height: Math.round(height + 2 * amplitude),
      width: Math.round(width + 2 * amplitude),
    };
  }

  private mergeContexts(messageContext: Context, lineContext: Context) {
    if (messageContext.context.canvas.height === 0) {
      return lineContext;
    }

    const maxWidth = Math.max(
      messageContext.context.canvas.width,
      lineContext.context.canvas.width
    );
    const totalHeight =
      messageContext.context.canvas.height + lineContext.context.canvas.height;

    const newContext = new Context(this._config, maxWidth, totalHeight);
    newContext.context.drawImage(messageContext.context.canvas, 0, 0);
    newContext.context.drawImage(
      lineContext.context.canvas,
      0,
      messageContext.context.canvas.height
    );

    return newContext;
  }
}
