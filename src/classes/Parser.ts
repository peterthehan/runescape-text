import wrap from "word-wrap";

import { colors, effectsMap, motions } from "../utils/effectUtil";

const UNSUPPORTED_FONT_CHARACTERS_REGEXP = /([^ -~\t\n]|`)+/g;

export default class Parser {
  private config: Config;
  private wordWrapConfig: wrap.IOptions;
  constructor(config: Config, wordWrapConfig: wrap.IOptions) {
    this.config = config;
    this.wordWrapConfig = wordWrapConfig;
  }

  parse(string: string) {
    const message = this.formatMessagePreExtract(string);
    const effects = this.extractMessageEffects(message);

    return {
      ...effects,
      message: this.formatMessagePostExtract(message),
    };
  }

  private formatMessagePreExtract(string: string) {
    return string
      .replace(UNSUPPORTED_FONT_CHARACTERS_REGEXP, this.config.replacement)
      .slice(0, this.config.maxMessageLength)
      .trimEnd();
  }

  private extractMessageEffects(string: string) {
    const effectsString = this.getEffectsString(string);
    return effectsString
      .toLowerCase()
      .split(this.config.suffix)
      .filter(Boolean)
      .reduce(
        (value, effect) => {
          if (effect.startsWith("pattern")) {
            return {
              ...value,
              color: "pattern" as Color,
              pattern: effect.replace("pattern", "").split(""),
            };
          }
          return { ...value, [effectsMap[effect]]: effect };
        },
        {
          color: this.config.color,
          motion: this.config.motion,
          pattern: [] as string[],
        }
      );
  }

  private formatMessagePostExtract(string: string) {
    const effectsString = this.getEffectsString(string);
    string = string.replace(effectsString, "");

    if (!this.config.enforceCapitalization) {
      return wrap(string, this.wordWrapConfig);
    }

    const leadingSpaces = " ".repeat(string.length - string.trimStart().length);
    const message = string
      .trim()
      .split(" ")
      .map((word, index) => {
        return (
          (index === 0 ? word.charAt(0).toUpperCase() : word.charAt(0)) +
          word.slice(1).toLowerCase()
        );
      })
      .join(" ");

    return wrap(leadingSpaces + message, this.wordWrapConfig);
  }

  private getEffectsString(string: string) {
    const escapedSuffix = this.config.suffix.replace(/(.{1})/g, "\\$1");

    const patternString = `pattern[a-z0-9]{1,8}`;
    const colorString =
      `(${[patternString, ...colors].join("|")})` + escapedSuffix;
    const motionString = `(${motions.join("|")})` + escapedSuffix;

    const effectsRegExp = RegExp(
      `^(${colorString}(${motionString})?|${motionString})`,
      "i"
    );

    return (string.match(effectsRegExp) || [""])[0];
  }
}
