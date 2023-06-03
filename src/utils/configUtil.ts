import wrap from "word-wrap";

import { defaultOptions } from "../defaultOptions";
import { defaultWordWrapOptions } from "../defaultWordWrapOptions";

export function getConfig(options: Options): Config {
  const merged = { ...defaultOptions, ...options };
  const delayPerFrame = 1000 / (merged.fps as number);
  const totalFrames = Math.round(
    (merged.cycleDuration as number) / delayPerFrame
  );

  return { ...merged, delayPerFrame, totalFrames } as Config;
}

export const getWordWrapConfig = (options: wrap.IOptions) => {
  return { ...defaultWordWrapOptions, ...options };
};
