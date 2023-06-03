import wrap from "word-wrap";
import ValueError from "../errors/ValueError";
import { colors, motions, effectsMap } from "../utils/effectUtil";

export default class Parser {
  config: Config;
  wordWrapConfig: wrap.IOptions;
  effectsRegExp: RegExp;
  constructor(config: Config, wordWrapConfig: wrap.IOptions) {
    this.config = config;
    this.wordWrapConfig = wordWrapConfig;

    const escapedSuffix = this.config.suffix.replace(/(.{1})/g, "\\$1");
    const colorString = `(${colors.join("|")})${escapedSuffix}`;
    const motionString = `(${motions.join("|")})${escapedSuffix}`;

    this.effectsRegExp = RegExp(
      `^${colorString}(${motionString})?|^${motionString}(${colorString})?`,
      "i"
    );
  }

  sanitizeMessage(string: string, effectsString: string) {
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

  parse(string: string) {
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
