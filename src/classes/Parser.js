const wrap = require("word-wrap");
const ValueError = require("./ValueError");
const { colors, motions, effectsMap } = require("../utils/effectUtil");

class Parser {
  constructor(config, wordWrapConfig) {
    this.config = config;
    this.wordWrapConfig = wordWrapConfig;

    this.setEffectsRegExp();
  }

  setEffectsRegExp() {
    const escapedSuffix = this.config.suffix.replace(/(.{1})/g, "\\$1");
    const colorString = `(${colors.join("|")})${escapedSuffix}`;
    const motionString = `(${motions.join("|")})${escapedSuffix}`;

    this.effectsRegExp = RegExp(
      `^${colorString}(${motionString})?|^${motionString}(${colorString})?`,
      "i"
    );
  }

  sanitizeMessage(string, effectsString) {
    const sanitizedMessage = string
      .replace(effectsString, "")
      .replace(/([^ -~\t\n]|`)+/g, this.config.replacement)
      .trimStart()
      .slice(0, this.config.maxMessageLength);

    if (sanitizedMessage === "") {
      throw new ValueError("message cannot be empty");
    }

    return wrap(sanitizedMessage, this.wordWrapConfig);
  }

  parse(string) {
    const effectsString = (string.match(this.effectsRegExp) || [""])[0];
    const effects = effectsString
      .toLowerCase()
      .split(this.config.suffix)
      .filter(Boolean)
      .reduce((value, effect) => ({ ...value, [effectsMap[effect]]: effect }), {
        color: this.config.color,
        motion: this.config.motion,
      });

    return {
      ...effects,
      message: this.sanitizeMessage(string, effectsString),
    };
  }
}

module.exports = Parser;
