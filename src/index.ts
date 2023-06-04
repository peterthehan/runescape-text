import wrap from "word-wrap";

import ColorStyle from "./classes/ColorStyle";
import Encoder from "./classes/Encoder";
import Logger from "./classes/Logger";
import MotionStyle from "./classes/MotionStyle";
import Parser from "./classes/Parser";
import { getConfig, getWordWrapConfig } from "./utils/configUtil";

export default function getRuneScapeText(
  string: string,
  options?: Options,
  wordWrapOptions?: wrap.IOptions
): RuneScapeTextResponse {
  const config = getConfig(options);
  const wordWrapConfig = getWordWrapConfig(wordWrapOptions);

  const logger = new Logger(config.debug);

  const { colorStyle, encoder, motionStyle, parser } = logger.time(
    "Initializing",
    () => {
      const parser = new Parser(config, wordWrapConfig);
      const colorStyle = new ColorStyle(config);
      const motionStyle = new MotionStyle(config);
      const encoder = new Encoder(config);

      return { colorStyle, encoder, motionStyle, parser };
    }
  );

  const { color, message, motion } = logger.time("Parsing", () => {
    return parser.parse(string);
  });

  const contexts = logger.time("Rendering", () => {
    colorStyle.setColor(color);
    motionStyle.setMotion(motion);

    return motionStyle.render(message, colorStyle);
  });

  const response = logger.time("Encoding", () => {
    return encoder.encode(contexts);
  });

  return response;
}
