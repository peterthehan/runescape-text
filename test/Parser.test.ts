import Parser from "../src/classes/Parser";
import { getConfig, getWordWrapConfig } from "../src/utils/configUtil";

const happyPathTestCases = [
  {
    expected: {
      color: "yellow",
      message: "Hello world",
      motion: "none",
      pattern: [],
    },
    message: "hello world",
  },
  {
    expected: {
      color: "yellow",
      message: "Hello World",
      motion: "none",
      pattern: [],
    },
    message: "HELLO WORLD",
  },
  {
    expected: {
      color: "glow3",
      message: "Hello world",
      motion: "wave",
      pattern: [],
    },
    message: "glow3:wave:hello world",
  },
  {
    expected: {
      color: "glow3",
      message: "Hello world",
      motion: "wave",
      pattern: [],
    },
    message: "GLOW3:WAVE:hello world",
  },
  {
    expected: {
      color: "glow3",
      message: "   Hello world",
      motion: "wave",
      pattern: [],
    },
    message: "glow3:wave:   hello world",
  },
  {
    expected: {
      color: "pattern",
      message: "Hello world",
      motion: "none",
      pattern: ["a", "b", "c"],
    },
    message: "patternabc:hello world",
  },
];
const sadPathTestCases = [
  // color must come before motion
  {
    expected: {
      color: "yellow",
      message: "Glow3:hello world",
      motion: "wave",
      pattern: [],
    },
    message: "wave:glow3:hello world",
  },
  // there cannot be spaces in between effects
  {
    expected: {
      color: "glow3",
      message: " Wave: hello world",
      motion: "none",
      pattern: [],
    },
    message: "glow3: wave: hello world",
  },
  // no effects are applied if there are leading spaces
  {
    expected: {
      color: "yellow",
      message: "   Glow3:wave:hello world",
      motion: "none",
      pattern: [],
    },
    message: "   glow3:wave:hello world",
  },
  // no effects are applied if the leading effect is not real
  {
    expected: {
      color: "yellow",
      message: "Blah:wave:hello world",
      motion: "none",
      pattern: [],
    },
    message: "blah:wave:hello world",
  },
  // invalid pattern
  {
    expected: {
      color: "yellow",
      message: "Pattern!@#:hello world",
      motion: "none",
      pattern: [],
    },
    message: "pattern!@#:hello world",
  },
];

describe("Parser", () => {
  test.each([...happyPathTestCases, ...sadPathTestCases])(
    `.parse("$message") = $expected`,
    ({ expected, message }) => {
      const config = getConfig();
      const wordWrapConfig = getWordWrapConfig();
      const parser = new Parser(config, wordWrapConfig);

      expect(parser.parse(message)).toStrictEqual(expected);
    }
  );
});
