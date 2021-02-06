const Encoder = require("./classes/Encoder");
const Logger = require("./classes/Logger");
const Parser = require("./classes/Parser");
const Renderer = require("./classes/Renderer");
const { getConfig, getWordWrapConfig } = require("./utils/configUtil");
const { validateInputs } = require("./utils/validateInputs");

const getRuneScapeText = (string, options = {}, wordWrapOptions = {}) => {
  validateInputs(string, options, wordWrapOptions);

  const config = getConfig(options);
  const wordWrapConfig = getWordWrapConfig(wordWrapOptions);

  const logger = new Logger(config.showLogs);

  const parsed = logger.time("Parsing", () =>
    new Parser(string, config, wordWrapConfig).parseString()
  );
  const contexts = logger.time("Rendering", () =>
    new Renderer(parsed, config).renderContexts()
  );
  const encodedImage = logger.time("Encoding", () =>
    new Encoder(contexts, config).encodeImage()
  );

  return encodedImage;
};

module.exports = getRuneScapeText;
