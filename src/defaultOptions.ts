import { Options } from "./types";

export const defaultOptions: Required<Options> = {
  color: "yellow",
  debug: false,
  duration: 3000,
  enforceCapitalization: true,
  format: "rgba4444",
  fps: 20,
  hasShadow: true,
  maxMessageLength: 80,
  maxPatternLength: 8,
  motion: "none",
  paddingBottom: 0,
  paddingLeft: 0,
  paddingRight: 0,
  paddingTop: 0,
  pattern: [],
  replacement: "",
  scale: 2,
  shadowColor: [0, 0, 0],
  suffix: ":",
  version: "osrs",
};
