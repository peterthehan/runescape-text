const Color = require("./classes/Color");
const Encoder = require("./classes/Encoder");
const Logger = require("./classes/Logger");
const Motion = require("./classes/Motion");
const Parser = require("./classes/Parser");
const { getConfig, getWordWrapConfig } = require("./utils/configUtil");
const { validateInputs } = require("./utils/validateInputs");

const getRuneScapeText = (string, options = {}, wordWrapOptions = {}) => {
  validateInputs(string, options, wordWrapOptions);

  const config = getConfig(options);
  const wordWrapConfig = getWordWrapConfig(wordWrapOptions);

  const logger = new Logger(config.showLogs);

  const { parser, color, motion, encoder } = logger.time("Initializing", () => {
    const parser = new Parser(config, wordWrapConfig);
    const color = new Color(config);
    const motion = new Motion(config);
    const encoder = new Encoder(config);

    return { parser, color, motion, encoder };
  });

  const parsed = logger.time("Parsing", () => parser.parse(string));

  const contexts = logger.time("Rendering", () => {
    color.setColor(parsed.color);
    motion.setMotion(parsed.motion);

    return motion.render(parsed.message, color);
  });

  const encoded = logger.time("Encoding", () => encoder.encode(contexts));

  return encoded;
};

module.exports = getRuneScapeText;
