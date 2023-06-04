import wrap from "word-wrap";

import { defaultOptions } from "../defaultOptions";
import { defaultWordWrapOptions } from "../defaultWordWrapOptions";

export function getConfig(options: Options = {}): Config {
  const merged = { ...defaultOptions, ...options } as Required<Options>;
  const delayPerFrame = 1000 / merged.fps;
  const totalFrames = Math.round(merged.duration / delayPerFrame);

  return { ...merged, delayPerFrame, totalFrames };
}

export function getWordWrapConfig(wordWrapOptions: wrap.IOptions = {}) {
  return { ...defaultWordWrapOptions, ...wordWrapOptions };
}
