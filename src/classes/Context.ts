import { CanvasRenderingContext2D, createCanvas, registerFont } from "canvas";
import { resolve } from "path";

const path = resolve(__dirname, "../assets/runescape_uf.ttf");
registerFont(path, { family: "RuneScape" });

const FONT_BASE_SIZE = 16;
const FONT_NAME = "RuneScape";

export class Context {
  context: CanvasRenderingContext2D;
  scale: number;
  constructor(width: number, height: number, scale: number) {
    this.context = createCanvas(width, height).getContext("2d");
    this.scale = scale;
  }

  initialize() {
    const fontSize = FONT_BASE_SIZE * this.scale;
    this.context.font = `${fontSize}px ${FONT_NAME}`;
    this.context.shadowColor = "black";
    this.context.shadowOffsetX = this.scale;
    this.context.shadowOffsetY = this.scale;

    return this.context;
  }
}

export function measureText(message: string, scale: number) {
  const context = createCanvas(0, 0).getContext("2d");
  const fontSize = FONT_BASE_SIZE * scale;
  context.font = `${fontSize}px ${FONT_NAME}`;
  const measurement = context.measureText(message);

  return {
    ascent: measurement.actualBoundingBoxAscent,
    height:
      measurement.actualBoundingBoxAscent +
      measurement.actualBoundingBoxDescent +
      scale,
    width: measurement.width,
  };
}
