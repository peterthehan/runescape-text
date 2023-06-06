import { CanvasRenderingContext2D, createCanvas, registerFont } from "canvas";
import { resolve } from "path";

const path = resolve(__dirname, "../assets/runescape_uf.ttf");
registerFont(path, { family: "RuneScape" });

const FONT_BASE_SIZE = 16;
const FONT_NAME = "RuneScape";

export default class Context {
  private config: Config;
  context: CanvasRenderingContext2D;
  constructor(config: Config, width = 0, height = 0) {
    this.config = config;
    this.context = createCanvas(width, height).getContext("2d");
  }

  initialize() {
    this.context.font = this.getFont();
    if (this.config.hasShadow) {
      this.context.shadowColor = "black";
      this.context.shadowOffsetX = this.config.scale;
      this.context.shadowOffsetY = this.config.scale;
    }

    return this.context;
  }

  measureText(text: string) {
    this.context.font = this.getFont();
    const measurement = this.context.measureText(text);

    return {
      ascent: measurement.actualBoundingBoxAscent,
      height:
        measurement.actualBoundingBoxAscent +
        measurement.actualBoundingBoxDescent +
        (this.config.hasShadow ? this.config.scale : 0),
      width: measurement.width,
    };
  }

  private getFont() {
    const fontSize = FONT_BASE_SIZE * this.config.scale;
    return `${fontSize}px ${FONT_NAME}`;
  }
}
