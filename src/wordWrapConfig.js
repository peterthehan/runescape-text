const wordWrapConfig = {
  width: 50,
  indent: "",
  newline: "\n",
  escape: (str) => str.trimEnd(),
  trim: false,
  cut: false,
};

module.exports = wordWrapConfig;
