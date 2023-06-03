#!/usr/bin/env node

import * as console from "console";
import { existsSync, writeFileSync } from "fs";

import { name, version } from "../package.json";
import getRuneScapeText from "./index";

const getFilename = () => {
  return `runescape-text-${Date.now()}`;
};

const main = async () => {
  console.log(`${name} v${version}`);

  const filename = getFilename();
  if (existsSync(`./${filename}.gif`) || existsSync(`./${filename}.png`)) {
    console.log(`File with name "${filename}" already exists! Exiting...`);
    process.exit(1);
  }

  const [, , ...args] = process.argv;
  const string = args.join(" ");
  const options = { debug: true };

  const { extension, buffer } = getRuneScapeText(string, options);
  const path = `./${filename}.${extension}`;
  writeFileSync(path, await buffer);
  console.log(`\nFile written to: ${path}`);
};

main();
