import { CanvasRenderingContext2D, createCanvas, registerFont } from "canvas";
import { resolve } from "path";

const path = resolve(__dirname, "../assets/runescape_uf.ttf");
registerFont(path, { family: "RuneScape" });

const FONT_BASE_SIZE = 16;
const FONT_NAME = "RuneScape";

export default class Context {
  context: CanvasRenderingContext2D;
  constructor(width = 0, height = 0) {
    this.context = createCanvas(width, height).getContext("2d");
  }

  initialize(scale: number) {
    this.context.font = this.getFont(scale);
    this.context.shadowColor = "black";
    this.context.shadowOffsetX = scale;
    this.context.shadowOffsetY = scale;

    return this.context;
  }

  measureText(text: string, scale: number) {
    this.context.font = this.getFont(scale);
    const measurement = this.context.measureText(text);

    return {
      ascent: measurement.actualBoundingBoxAscent,
      height:
        measurement.actualBoundingBoxAscent +
        measurement.actualBoundingBoxDescent +
        scale,
      width: measurement.width,
    };
  }

  private getFont(scale: number) {
    const fontSize = FONT_BASE_SIZE * scale;
    return `${fontSize}px ${FONT_NAME}`;
  }
}
