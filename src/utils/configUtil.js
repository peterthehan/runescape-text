const config = require("../config");
const wordWrapConfig = require("../wordWrapConfig");

const getConfig = (options) => {
  const merged = { ...config, ...options };
  const delayPerFrame = 1000 / merged.fps;
  const totalFrames = Math.round(merged.cycleDuration / delayPerFrame);

  return {
    ...merged,
    delayPerFrame,
    totalFrames,
  };
};

const getWordWrapConfig = (options) => {
  return { ...wordWrapConfig, ...options };
};

module.exports = {
  getConfig,
  getWordWrapConfig,
};
