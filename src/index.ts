import wrap from "word-wrap";

import Color from "./classes/ColorStyle";
import Encoder from "./classes/Encoder";
import Logger from "./classes/Logger";
import Motion from "./classes/MotionStyle";
import Parser from "./classes/Parser";
import { defaultOptions } from "./defaultOptions";
import { defaultWordWrapOptions } from "./defaultWordWrapOptions";
import { getConfig, getWordWrapConfig } from "./utils/configUtil";

export default function getRuneScapeText(
  string: string,
  options: Options = defaultOptions,
  wordWrapOptions: wrap.IOptions = defaultWordWrapOptions
) {
  const config = getConfig(options);
  const wordWrapConfig = getWordWrapConfig(wordWrapOptions);

  const logger = new Logger(config.debug);

  const { parser, color, motion, encoder } = logger.time("Initializing", () => {
    const parser = new Parser(config, wordWrapConfig);
    const color = new Color(config);
    const motion = new Motion(config);
    const encoder = new Encoder(config);

    return { parser, color, motion, encoder };
  });

  const parsed = logger.time("Parsing", () => {
    return parser.parse(string);
  });

  const contexts = logger.time("Rendering", () => {
    color.setColor(parsed.color);
    motion.setMotion(parsed.motion);

    return motion.render(parsed.message, color);
  });

  const encoded = logger.time("Encoding", () => {
    return encoder.encode(contexts);
  });

  return encoded;
}
