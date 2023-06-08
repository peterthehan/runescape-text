import { CanvasRenderingContext2D, createCanvas, registerFont } from "canvas";
import { resolve } from "path";

const path = resolve(__dirname, "../assets/runescape_uf.ttf");
registerFont(path, { family: "RuneScape" });

const FONT_BASE_SIZE = 16;
const FONT_NAME = "RuneScape";

export default class Context {
  private config: Config;
  private _context: CanvasRenderingContext2D;
  constructor(config: Config, width = 0, height = 0) {
    this.config = config;
    this._context = createCanvas(width, height).getContext("2d");
    this._context.font = `${FONT_BASE_SIZE * this.config.scale}px ${FONT_NAME}`;
  }

  get context() {
    return this._context;
  }

  initialize() {
    if (this.config.hasShadow) {
      this._context.shadowColor = this.config.shadowColor;
      this._context.shadowOffsetX = this.config.scale;
      this._context.shadowOffsetY = this.config.scale;
    }

    return this;
  }

  measureText(text: string) {
    const {
      actualBoundingBoxAscent: ascent,
      actualBoundingBoxDescent: descent,
      width,
    } = this._context.measureText(text);

    return { ascent, height: ascent + descent, width };
  }
}
