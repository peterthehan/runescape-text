#!/usr/bin/env node

import { existsSync, writeFileSync } from "node:fs";

import getRuneScapeText from "./index";
import { Options } from "./types";

async function main() {
  const file = `./runescape-text-${Date.now()}.gif`;
  if (existsSync(file)) {
    console.log(`${file} already exists. Exiting...`);
    process.exit(1);
  }

  const [, , ...args] = process.argv;
  const string = args.join(" ");
  const options = { debug: true } as Options;
  const wordWrapOptions = {};

  const { data } = getRuneScapeText(string, options, wordWrapOptions);

  writeFileSync(file, data);
  console.log(`\nFile written to: ${file}`);
}

main();
