import { CanvasRenderingContext2D, createCanvas, registerFont } from "canvas";
import { resolve } from "path";

const path = resolve(__dirname, "../assets/runescape_uf.ttf");
registerFont(path, {
  family: "RuneScape",
});

const FONT = "RuneScape";

export class Context {
  scale: number;
  context: CanvasRenderingContext2D;
  constructor(width: number, height: number, scale: number) {
    this.context = createCanvas(width, height).getContext("2d");
    this.scale = scale;
  }

  getStatic() {
    const fontSize = 16 * this.scale;
    this.context.font = `${fontSize}px ${FONT}`;
    this.context.shadowColor = "black";
    this.context.shadowOffsetX = this.scale;
    this.context.shadowOffsetY = this.scale;

    return this.context;
  }

  getDynamic() {
    this.getStatic();
    this.getMerge();

    return this.context;
  }

  getMerge() {
    const { height, width } = this.context.canvas;
    this.context.fillStyle = "rgba(128, 128, 128, 1)";
    this.context.fillRect(0, 0, width, height);

    return this.context;
  }
}

export function measureText(message: string, scale: number) {
  const fontSize = 16 * scale;
  const context = createCanvas(0, 0).getContext("2d");
  context.font = `${fontSize}px ${FONT}`;
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
