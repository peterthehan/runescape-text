#!/usr/bin/env node

const fs = require("fs");
const getRuneScapeText = require("./index");

const main = async () => {
  const [, , ...args] = process.argv;
  const string = args.join(" ");
  const options = { showLogs: true };

  const { extension, buffer } = getRuneScapeText(string, options);

  const path = `./runescape-text.${extension}`;
  fs.writeFileSync(path, await buffer);
  console.log(`\nFile written to: ${path}`);
};

main();
