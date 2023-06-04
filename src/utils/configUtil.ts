import wrap from "word-wrap";

import { defaultOptions } from "../defaultOptions";
import { defaultWordWrapOptions } from "../defaultWordWrapOptions";

export function getConfig(options: Options = {}): Config {
  const mergedOptions = { ...defaultOptions, ...options } as Required<Options>;
  const delayPerFrame = 1000 / mergedOptions.fps;
  const totalFrames = Math.round(mergedOptions.duration / delayPerFrame);

  return { ...mergedOptions, delayPerFrame, totalFrames };
}

export function getWordWrapConfig(wordWrapOptions: wrap.IOptions = {}) {
  return { ...defaultWordWrapOptions, ...wordWrapOptions };
}
