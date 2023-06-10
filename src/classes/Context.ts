import { CanvasRenderingContext2D, createCanvas, registerFont } from "canvas";
import { resolve } from "path";

import { Config, ContextFillInput } from "../types";

const path = resolve(__dirname, "../assets/runescape_uf.ttf");
registerFont(path, { family: "RuneScape" });

const FONT_BASE_SIZE = 16;
const FONT_NAME = "RuneScape";

export default class Context {
  private _config: Config;
  private _context: CanvasRenderingContext2D;
  constructor(config: Config, width = 0, height = 0) {
    this._config = config;
    this._context = createCanvas(width, height).getContext("2d");
    this._context.font = `${
      FONT_BASE_SIZE * this._config.scale
    }px ${FONT_NAME}`;
  }

  get context() {
    return this._context;
  }

  initialize() {
    if (this._config.hasShadow) {
      this._context.shadowColor = this._config.shadowColor;
      this._context.shadowOffsetX = this._config.scale;
      this._context.shadowOffsetY = this._config.scale;
    }

    return this;
  }

  fill({ colorEffect, fragment, frame, index, x, y }: ContextFillInput) {
    this._context.fillStyle = colorEffect.calculate({ frame, index });
    this._context.fillText(fragment, x, y);

    return this;
  }

  measureText(text: string) {
    const {
      actualBoundingBoxAscent: ascent,
      actualBoundingBoxDescent: descent,
      width,
    } = this._context.measureText(text);

    return {
      ascent,
      height:
        ascent + descent + (this._config.hasShadow ? this._config.scale : 0),
      width,
    };
  }
}
