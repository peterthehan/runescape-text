import wrap from "word-wrap";

import { defaultOptions } from "../defaultOptions";
import { defaultWordWrapOptions } from "../defaultWordWrapOptions";
import { Config, Options } from "../types";

function getConfig(options: Options = {}): Config {
  const mergedOptions = { ...defaultOptions, ...options } as Required<Options>;
  const delayPerFrame = 1000 / mergedOptions.fps;
  const totalFrames = Math.round(mergedOptions.duration / delayPerFrame);

  return { ...mergedOptions, delayPerFrame, totalFrames };
}

function getWordWrapConfig(wordWrapOptions: wrap.IOptions = {}): wrap.IOptions {
  return { ...defaultWordWrapOptions, ...wordWrapOptions };
}

export { getConfig, getWordWrapConfig };
