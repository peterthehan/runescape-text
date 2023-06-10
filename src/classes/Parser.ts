import wrap from "word-wrap";

import { Config, EffectsOptions } from "../types";
import { COLORS, EFFECTS_MAP, MOTIONS } from "../utils/EffectsUtil";

const UNSUPPORTED_FONT_CHARACTERS_REGEXP = /([^ -~\t\n]|`)+/g;

export default class Parser {
  private _config: Config;
  private _wordWrapConfig: wrap.IOptions;
  constructor(config: Config, wordWrapConfig: wrap.IOptions) {
    this._config = config;
    this._wordWrapConfig = wordWrapConfig;
  }

  parse(string: string) {
    const sanitizedMessage = this.sanitizeMessage(string);
    const effectsString = this.getEffectsString(string);

    const message = this.formatMessage(sanitizedMessage, effectsString);
    const effects = this.getMessageEffects(effectsString);

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
      .replace(UNSUPPORTED_FONT_CHARACTERS_REGEXP, this._config.replacement)
      .slice(0, this._config.maxMessageLength);
  }

  private getEffectsString(string: string) {
    const escapedSuffix = "\\" + this._config.suffix.split("").join("\\");

    const patternString = `pattern[a-z0-9]{1,8}`;
    const colorString =
      `(${patternString}|${COLORS.join("|")})` + escapedSuffix;
    const motionString = `(${MOTIONS.join("|")})` + escapedSuffix;

    const effectsRegExp = RegExp(
      `^(${colorString}(${motionString})?|${motionString})`,
      "i"
    );

    return (string.match(effectsRegExp) ?? [""])[0];
  }

  private formatMessage(string: string, effectsString: string) {
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
      this._config.enforceCapitalization
        ? this.applyCapitalization(string)
        : string,
      this._wordWrapConfig
    );
  }

  private getMessageEffects(effectsString: string) {
    return effectsString
      .toLowerCase()
      .split(this._config.suffix)
      .filter(Boolean)
      .reduce(
        (value, effect) => {
          if (effect.startsWith("pattern")) {
            return {
              ...value,
              color: "pattern",
              pattern: effect.replace("pattern", "").split(""),
            } as Required<EffectsOptions>;
          }
          return { ...value, [EFFECTS_MAP[effect]]: effect };
        },
        {
          color: this._config.color,
          motion: this._config.motion,
          pattern: this._config.pattern,
        }
      );
  }

  private applyCapitalization(string: string) {
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
