import Parser from "../src/classes/Parser";
import { getConfig, getWordWrapConfig } from "../src/utils/configUtil";

const errorTestCases = [
  {
    expected: "The message string cannot be empty.",
    message: "",
  },
  {
    expected: "The message string cannot consist of only whitespaces.",
    message: "   ",
  },
  {
    expected:
      "The effects cannot be applied to a message string that is empty.",
    message: "glow3:",
  },
  {
    expected:
      "The effects cannot be applied to a message string that consists of only whitespaces.",
    message: "glow3:   ",
  },
];

const baseTestCase = {
  expected: {
    color: "yellow",
    message: "Hello world",
    motion: "none",
    pattern: [],
  },
  message: "hello world",
};

const capitalizationTestCases = [
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
      color: "yellow",
      message: "Hello.. Hello... World? Hello. World!",
      motion: "none",
      pattern: [],
    },
    message: "hello.. hello... world? hello. world!",
  },
];

const whitespaceTestCases = [
  {
    expected: {
      color: "yellow",
      message: "   Hello world",
      motion: "none",
      pattern: [],
    },
    message: "   hello world",
  },
  {
    expected: {
      color: "yellow",
      message: "Hello world",
      motion: "none",
      pattern: [],
    },
    message: "hello world   ",
  },
  {
    expected: {
      color: "yellow",
      message: "Hello   world",
      motion: "none",
      pattern: [],
    },
    message: "hello   world",
  },
];

const happyPathTestCases = [
  {
    expected: {
      color: "glow3",
      message: "Hello world",
      motion: "none",
      pattern: [],
    },
    message: "glow3:hello world",
  },
  {
    expected: {
      color: "yellow",
      message: "Hello world",
      motion: "wave",
      pattern: [],
    },
    message: "wave:hello world",
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
];

const sadPathTestCases = [
  // invalid effect
  {
    expected: {
      color: "yellow",
      message: "Blah:hello world",
      motion: "none",
      pattern: [],
    },
    message: "blah:hello world",
  },
  // no effects are applied if the leading effect is invalid
  {
    expected: {
      color: "yellow",
      message: "Blah:wave:hello world",
      motion: "none",
      pattern: [],
    },
    message: "blah:wave:hello world",
  },
  // first effect is still applied if second effect is invalid
  {
    expected: {
      color: "yellow",
      message: "Blah:hello world",
      motion: "wave",
      pattern: [],
    },
    message: "wave:blah:hello world",
  },
  // first effect is used when using two effects of the same type
  {
    expected: {
      color: "glow3",
      message: "Glow1:hello world",
      motion: "none",
      pattern: [],
    },
    message: "glow3:glow1:hello world",
  },
  // only first two effects are parsed
  {
    expected: {
      color: "glow3",
      message: "Glow1:wave:hello world",
      motion: "none",
      pattern: [],
    },
    message: "glow3:glow1:wave:hello world",
  },
  {
    expected: {
      color: "glow3",
      message: "Glow1:hello world",
      motion: "wave",
      pattern: [],
    },
    message: "glow3:wave:glow1:hello world",
  },
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
      message: " Wave:hello world",
      motion: "none",
      pattern: [],
    },
    message: "glow3: wave:hello world",
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
];

const patternTestCases = [
  {
    expected: {
      color: "pattern",
      message: "Hello world",
      motion: "none",
      pattern: ["a", "b", "c"],
    },
    message: "patternabc:hello world",
  },
  // invalid pattern characters
  {
    expected: {
      color: "yellow",
      message: "Pattern!@#:hello world",
      motion: "none",
      pattern: [],
    },
    message: "pattern!@#:hello world",
  },
  // no pattern characters given
  {
    expected: {
      color: "yellow",
      message: "Pattern:hello world",
      motion: "none",
      pattern: [],
    },
    message: "pattern:hello world",
  },
  // too many pattern characters given
  {
    expected: {
      color: "yellow",
      message: "Pattern123456789:hello world",
      motion: "none",
      pattern: [],
    },
    message: "pattern123456789:hello world",
  },
];

describe("Parser", () => {
  let parser: Parser;

  beforeAll(() => {
    const config = getConfig();
    const wordWrapConfig = getWordWrapConfig();
    parser = new Parser(config, wordWrapConfig);
  });

  test.each([...errorTestCases])(
    `.parse("$message") => $expected`,
    ({ expected, message }) => {
      expect(() => parser.parse(message)).toThrow(new Error(expected));
    }
  );

  test.each([
    baseTestCase,
    ...capitalizationTestCases,
    ...whitespaceTestCases,
    ...happyPathTestCases,
    ...sadPathTestCases,
    ...patternTestCases,
  ])(`.parse("$message") => $expected`, ({ expected, message }) => {
    expect(parser.parse(message)).toStrictEqual(expected);
  });
});
