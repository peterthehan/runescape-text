import { readFileSync } from "node:fs";

import getRuneScapeText from "../src/index";

const testCases = [
  {
    fileName: "./test/resources/asdf.gif",
    message: "asdf",
    options: {},
    wordWrapOptions: {},
  },
  {
    fileName: "./test/resources/glow3_wave_asdf.gif",
    message: "glow3:wave:asdf",
    options: {},
    wordWrapOptions: {},
  },
  {
    fileName: "./test/resources/multi_line_hello_world.gif",
    message: "hello world",
    options: {},
    wordWrapOptions: { width: 5 },
  },
  {
    fileName: "./test/resources/multi_line_flash1_slide_hello_world.gif",
    message: "flash1:slide:hello world",
    options: {},
    wordWrapOptions: { width: 5 },
  },
  {
    fileName: "./test/resources/multi_line_patternkdomph_shake_hello_world.gif",
    message: "patternkdomph:shake:hello world",
    options: {},
    wordWrapOptions: { width: 5 },
  },
  {
    fileName: "./test/resources/rainbow_0s.gif",
    message:
      "rainbow:000000000000000000000000000000000000000000000000000000000000000000000000",
    options: {},
    wordWrapOptions: {},
  },
];

describe("Integration", () => {
  test.each(testCases)(
    `getRuneScapeText("$message", $options, $wordWrapOptions)`,
    ({ fileName, message, options, wordWrapOptions }) => {
      const { data } = getRuneScapeText(message, options, wordWrapOptions);
      const fileData = new Uint8Array(readFileSync(fileName));
      expect(data).toStrictEqual(fileData);
    }
  );
});
