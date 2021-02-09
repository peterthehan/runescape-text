#!/usr/bin/env node

const fs = require("fs");
const getRuneScapeText = require("./index");

const getFilename = () => {
  return `runescape-text-${Date.now()}`;
};

const main = async () => {
  const filename = getFilename();
  if (
    fs.existsSync(`./${filename}.gif`) ||
    fs.existsSync(`./${filename}.png`)
  ) {
    console.log(`File with name "${filename}" already exists! Exiting...`);
    process.exitCode = 1;

    return;
  }

  const [, , ...args] = process.argv;
  const string = args.join(" ");
  const options = { showLogs: true };

  const { extension, buffer } = getRuneScapeText(string, options);

  const path = `./${filename}.${extension}`;
  fs.writeFileSync(path, await buffer);
  console.log(`\nFile written to: ${path}`);
};

main();
