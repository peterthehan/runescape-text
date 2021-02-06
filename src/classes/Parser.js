const wrap = require("word-wrap");
const ValueError = require("./ValueError");
const { colors, motions, effectsMap } = require("../utils/effectUtil");

class Parser {
  constructor(string, config, wordWrapConfig) {
    this.string = string;
    this.config = config;
    this.wordWrapConfig = wordWrapConfig;
  }

  getEffectsRegExp() {
    const escapedSuffix = this.config.suffix.replace(/(.{1})/g, "\\$1");
    const colorString = `(${colors.join("|")})${escapedSuffix}`;
    const motionString = `(${motions.join("|")})${escapedSuffix}`;

    return RegExp(
      `^${colorString}(${motionString})?|^${motionString}(${colorString})?`,
      "i"
    );
  }

  sanitizeMessage(effectsString) {
    const sanitizedMessage = this.string
      .replace(effectsString, "")
      .replace(/([^ -~\t\n]|`)+/g, this.config.replacement)
      .trimStart()
      .slice(0, this.config.maxMessageLength);

    if (sanitizedMessage === "") {
      throw new ValueError("message cannot be empty");
    }

    return wrap(sanitizedMessage, this.wordWrapConfig);
  }

  parseString() {
    const effectsRegExp = this.getEffectsRegExp();
    const effectsString = (this.string.match(effectsRegExp) || [""])[0];

    const effect = effectsString
      .split(this.config.suffix)
      .filter(Boolean)
      .reduce((value, effect) => ({ ...value, [effectsMap[effect]]: effect }), {
        color: this.config.color,
        motion: this.config.motion,
      });

    return {
      ...effect,
      message: this.sanitizeMessage(effectsString),
    };
  }
}

module.exports = Parser;
