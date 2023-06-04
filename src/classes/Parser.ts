import wrap from "word-wrap";

import ValueError from "../errors/ValueError";
import { colors, effectsMap, motions } from "../utils/effectUtil";

export default class Parser {
  private config: Config;
  private wordWrapConfig: wrap.IOptions;
  constructor(config: Config, wordWrapConfig: wrap.IOptions) {
    this.config = config;
    this.wordWrapConfig = wordWrapConfig;
  }

  parse(string: string) {
    const effectsString = (string.match(this.getEffectsRegExp()) || [""])[0];
    const effects = effectsString
      .toLowerCase()
      .split(this.config.suffix)
      .filter(Boolean)
      .reduce((value, effect) => ({ ...value, [effectsMap[effect]]: effect }), {
        color: this.config.color,
        motion: this.config.motion,
      });
    const message = this.sanitizeMessage(string, effectsString);

    return {
      ...effects,
      message: this.config.enforceCapitalization
        ? message
            .split(" ")
            .map((word, index) => {
              return (
                (index === 0 ? word.charAt(0).toUpperCase() : word.charAt(0)) +
                word.slice(1).toLowerCase()
              );
            })
            .join(" ")
        : message,
    };
  }

  private getEffectsRegExp() {
    const escapedSuffix = this.config.suffix.replace(/(.{1})/g, "\\$1");
    const colorString = `(${colors.join("|")})${escapedSuffix}`;
    const motionString = `(${motions.join("|")})${escapedSuffix}`;

    return RegExp(
      `^${colorString}(${motionString})?|^${motionString}(${colorString})?`,
      "i"
    );
  }

  private sanitizeMessage(string: string, effectsString: string) {
    const sanitizedMessage = string
      .slice(0, this.config.maxMessageLength)
      .replace(effectsString, "")
      .replace(/([^ -~\t\n]|`)+/g, this.config.replacement)
      .trim();

    if (sanitizedMessage === "") {
      throw new ValueError("message cannot be empty");
    }

    return wrap(sanitizedMessage, this.wordWrapConfig);
  }
}
