import Canvas from "canvas";
import { resolve } from "path";
import wrap from "word-wrap";

import ColorEffect from "./classes/ColorEffect";
import Encoder from "./classes/Encoder";
import Logger from "./classes/Logger";
import MotionEffect from "./classes/MotionEffect";
import Parser from "./classes/Parser";
import Renderer from "./classes/Renderer";
import { Options, RuneScapeTextResponse } from "./types";
import { getConfig, getWordWrapConfig } from "./utils/ConfigUtil";

if (Canvas.registerFont) {
  const path = resolve(__dirname, "./assets/runescape_uf.ttf");
  Canvas.registerFont(path, { family: "RuneScape" });
}

export default function getRuneScapeText(
  string: string,
  options?: Options,
  wordWrapOptions?: wrap.IOptions
): RuneScapeTextResponse {
  const config = getConfig(options);
  const wordWrapConfig = getWordWrapConfig(wordWrapOptions);

  const logger = new Logger(config.debug);

  const { colorEffect, encoder, motionEffect, parser, renderer } = logger.time(
    "Initializing",
    () => {
      const parser = new Parser(config, wordWrapConfig);
      const colorEffect = new ColorEffect(config);
      const motionEffect = new MotionEffect(config);
      const renderer = new Renderer(config);
      const encoder = new Encoder(config);

      return { colorEffect, encoder, motionEffect, parser, renderer };
    }
  );

  const { color, message, motion, pattern } = logger.time("Parsing", () => {
    return parser.parse(string);
  });

  logger.time("Setting", () => {
    colorEffect.setColor(color, pattern, message);
    motionEffect.setMotion(motion);
    renderer.setEffects(colorEffect, motionEffect);
  });

  const contexts = logger.time("Rendering", () => {
    return renderer.render(message);
  });

  const response = logger.time("Encoding", () => {
    return encoder.encode(contexts);
  });

  return { ...response, color, message, motion, pattern };
}
