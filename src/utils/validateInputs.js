const InvalidArgumentError = require("../classes/InvalidArgumentError");
const ValueError = require("../classes/ValueError");

const validateInputs = (string, options, wordWrapOptions) => {
  if (typeof string === "undefined") {
    throw new InvalidArgumentError("missing required string argument");
  }
  if (typeof string !== "string") {
    throw new TypeError("string is not a string");
  }

  if (string === "") {
    throw new ValueError("string cannot be empty");
  }

  if (typeof options !== "object") {
    throw new TypeError("options is not an object");
  }

  if (typeof wordWrapOptions !== "object") {
    throw new TypeError("wordWrapOptions is not an object");
  }
};

module.exports = {
  validateInputs,
};
