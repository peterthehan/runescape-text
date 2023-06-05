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
    const sanitizedMessage = this.sanitizeMessage(string);
    const message = this.formatMessage(sanitizedMessage);
    const effects = this.getMessageEffects(sanitizedMessage);

    return { ...effects, message };
  }

  private sanitizeMessage(string: string) {
    if (string === "") {
      throw Error("The message string cannot be empty.");
    }

    if (string.trim() === "") {
      throw Error("The message string cannot consist of only whitespaces.");
    }

    return string
      .replace(UNSUPPORTED_FONT_CHARACTERS_REGEXP, this.config.replacement)
      .slice(0, this.config.maxMessageLength);
  }

  private formatMessage(string: string) {
    const effectsString = this.getEffectsString(string);
    string = string.replace(effectsString, "");

    if (string === "") {
      throw new Error(
        "The effects cannot be applied to a message string that is empty."
      );
    }

    if (string.trim() === "") {
      throw new Error(
        "The effects cannot be applied to a message string that consists of only whitespaces."
      );
    }

    return wrap(
      this.config.enforceCapitalization
        ? this.capitalizeSentences(string)
        : string,
      this.wordWrapConfig
    );
  }

  private getMessageEffects(string: string) {
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

    return (string.match(effectsRegExp) ?? [""])[0];
  }

  private capitalizeSentences(string: string) {
    let capitalizeNextWord = true;
    return string
      .split(" ")
      .map((word) => {
        if (word === "") {
          return "";
        }

        const returnWord =
          (capitalizeNextWord ? word.charAt(0).toUpperCase() : word.charAt(0)) +
          word.slice(1).toLowerCase();

        capitalizeNextWord = [".", "!", "?"].some((punctuation) =>
          word.endsWith(punctuation)
        );

        return returnWord;
      })
      .join(" ");
  }
}
