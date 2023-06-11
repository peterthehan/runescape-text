import { Color, Motion, Pattern, RGB } from "../types";

const STATIC_COLORS = [
  "cyan",
  "green",
  "purple",
  "rainbow",
  "red",
  "white",
  "yellow",
];
const DYNAMIC_COLORS = [
  "flash1",
  "flash2",
  "flash3",
  "glow1",
  "glow2",
  "glow3",
];

const COLORS = [...STATIC_COLORS, ...DYNAMIC_COLORS];
const MOTIONS = ["scroll", "shake", "slide", "wave", "wave2"];

const EFFECTS_MAP = {
  ...Object.fromEntries([
    ...COLORS.map((color) => [color, "color"]),
    ...MOTIONS.map((motion) => [motion, "motion"]),
  ]),
};

function isAnimated(color: Color | Pattern, motion: Motion) {
  return motion !== "none" || DYNAMIC_COLORS.includes(color);
}

function requiresProcessingPerLine(color: Color | Pattern, motion: Motion) {
  return motion !== "none" || requiresProcessingPerCharacter(color, motion);
}

function requiresProcessingPerCharacter(
  color: Color | Pattern,
  motion: Motion
) {
  return (
    ["pattern", "rainbow"].includes(color) ||
    ["shake", "wave", "wave2"].includes(motion)
  );
}

const YELLOW: RGB = [255, 255, 0];
const RED: RGB = [255, 0, 0];
const GREEN: RGB = [0, 255, 0];
const CYAN: RGB = [0, 255, 255];
const PURPLE: RGB = [255, 0, 255];
const WHITE: RGB = [255, 255, 255];

// https://secure.runescape.com/m=news/bounty-hunter-changes--forestry-beta?oldschool=1
const PATTERN_0: RGB = WHITE;
const PATTERN_1: RGB = [228, 3, 3];
const PATTERN_2: RGB = [255, 140, 0];
const PATTERN_3: RGB = [255, 237, 0];
const PATTERN_4: RGB = [0, 128, 38];
const PATTERN_5: RGB = [36, 64, 142];
const PATTERN_6: RGB = [115, 41, 130];
const PATTERN_7: RGB = [255, 33, 140];
const PATTERN_8: RGB = [181, 86, 144];
const PATTERN_9: RGB = [80, 73, 204];
const PATTERN_A: RGB = [163, 163, 163];
const PATTERN_B: RGB = [213, 45, 0];
const PATTERN_C: RGB = [239, 118, 39];
const PATTERN_D: RGB = [252, 244, 52];
const PATTERN_E: RGB = [7, 141, 112];
const PATTERN_F: RGB = [33, 177, 255];
const PATTERN_G: RGB = [155, 79, 150];
const PATTERN_H: RGB = [255, 175, 199];
const PATTERN_I: RGB = [209, 98, 164];
const PATTERN_J: RGB = [123, 173, 227];
const PATTERN_K: RGB = [255, 154, 86];
const PATTERN_L: RGB = [38, 206, 170];
const PATTERN_M: RGB = [115, 215, 238];
const PATTERN_N: RGB = [156, 89, 209];
const PATTERN_O: RGB = [152, 232, 193];
const PATTERN_P: RGB = [181, 126, 220];
const PATTERN_Q: RGB = [44, 44, 44];
const PATTERN_R: RGB = [148, 2, 2];
const PATTERN_S: RGB = [97, 57, 21];
const PATTERN_T: RGB = [208, 193, 0];
const PATTERN_U: RGB = [74, 129, 35];
const PATTERN_V: RGB = [0, 56, 168];
const PATTERN_W: RGB = [128, 0, 128];
const PATTERN_X: RGB = [214, 2, 112];
const PATTERN_Y: RGB = [163, 2, 98];
const PATTERN_Z: RGB = [61, 26, 120];

const PATTERN_CHARACTER_TO_COLOR_MAP = {
  "0": PATTERN_0,
  "1": PATTERN_1,
  "2": PATTERN_2,
  "3": PATTERN_3,
  "4": PATTERN_4,
  "5": PATTERN_5,
  "6": PATTERN_6,
  "7": PATTERN_7,
  "8": PATTERN_8,
  "9": PATTERN_9,
  a: PATTERN_A,
  b: PATTERN_B,
  c: PATTERN_C,
  d: PATTERN_D,
  e: PATTERN_E,
  f: PATTERN_F,
  g: PATTERN_G,
  h: PATTERN_H,
  i: PATTERN_I,
  j: PATTERN_J,
  k: PATTERN_K,
  l: PATTERN_L,
  m: PATTERN_M,
  n: PATTERN_N,
  o: PATTERN_O,
  p: PATTERN_P,
  q: PATTERN_Q,
  r: PATTERN_R,
  s: PATTERN_S,
  t: PATTERN_T,
  u: PATTERN_U,
  v: PATTERN_V,
  w: PATTERN_W,
  x: PATTERN_X,
  y: PATTERN_Y,
  z: PATTERN_Z,
};

// not exported, only used to create flash and glow
const LIGHT_GREEN: RGB = [128, 255, 128];
const DARK_GREEN: RGB = [0, 176, 0];
const BLUE: RGB = [0, 0, 255];

const GLOW_1_RS3: RGB[] = [CYAN, GREEN, YELLOW, RED, CYAN];
const GLOW_2_RS3: RGB[] = [RED, BLUE, PURPLE, RED];
const GLOW_3_RS3: RGB[] = [CYAN, WHITE, GREEN, WHITE, CYAN];

const FLASH_1_RS3: RGB[] = [RED, YELLOW];
const FLASH_2_RS3: RGB[] = [BLUE, CYAN];
const FLASH_3_RS3: RGB[] = [DARK_GREEN, LIGHT_GREEN];

const GLOW_1_OSRS: RGB[] = [RED, YELLOW, GREEN, CYAN, RED];
const GLOW_2_OSRS: RGB[] = [RED, PURPLE, BLUE, RED];
const GLOW_3_OSRS: RGB[] = [WHITE, GREEN, WHITE, CYAN, WHITE];

const FLASH_1_OSRS: RGB[] = [RED, YELLOW];
const FLASH_2_OSRS: RGB[] = [CYAN, BLUE];
const FLASH_3_OSRS: RGB[] = [DARK_GREEN, LIGHT_GREEN];

const RAINBOW_BLUE: RGB = [0, 128, 255];
const RAINBOW_GREEN_1: RGB = [128, 255, 0];
const RAINBOW_GREEN_2: RGB = [0, 255, 128];
const RAINBOW_PURPLE: RGB = [128, 0, 255];
const RAINBOW_1: RGB[] = [RED];
const RAINBOW_2: RGB[] = [RED, CYAN];
const RAINBOW_3: RGB[] = [RED, GREEN, BLUE];
const RAINBOW_4: RGB[] = [RED, RAINBOW_GREEN_1, CYAN, RAINBOW_PURPLE];
const RAINBOW_5: RGB[] = [RED, YELLOW, RAINBOW_GREEN_2, RAINBOW_BLUE, PURPLE];
const RAINBOW_6: RGB[] = [RED, YELLOW, GREEN, CYAN, BLUE, PURPLE];
const RAINBOW_7: RGB[] = [RED, YELLOW, GREEN, CYAN, BLUE, PURPLE, RED];

export {
  COLORS,
  CYAN,
  EFFECTS_MAP,
  FLASH_1_OSRS,
  FLASH_1_RS3,
  FLASH_2_OSRS,
  FLASH_2_RS3,
  FLASH_3_OSRS,
  FLASH_3_RS3,
  GLOW_1_OSRS,
  GLOW_1_RS3,
  GLOW_2_OSRS,
  GLOW_2_RS3,
  GLOW_3_OSRS,
  GLOW_3_RS3,
  GREEN,
  isAnimated,
  MOTIONS,
  PATTERN_CHARACTER_TO_COLOR_MAP,
  PURPLE,
  RAINBOW_1,
  RAINBOW_2,
  RAINBOW_3,
  RAINBOW_4,
  RAINBOW_5,
  RAINBOW_6,
  RAINBOW_7,
  RED,
  requiresProcessingPerCharacter,
  requiresProcessingPerLine,
  WHITE,
  YELLOW,
};
