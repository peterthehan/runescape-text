const staticColors = [
  "yellow",
  "red",
  "green",
  "cyan",
  "purple",
  "white",
  "rainbow",
  "pattern",
];
const dynamicColors = ["glow1", "glow2", "glow3", "flash1", "flash2", "flash3"];
const colors = [...staticColors, ...dynamicColors];
const motions = ["wave", "wave2", "shake", "scroll", "slide"];

const effectsMap = {
  ...Object.fromEntries([
    ...colors.map((color) => [color, "color"]),
    ...motions.map((motion) => [motion, "motion"]),
  ]),
};

const yellow = [255, 255, 0];
const red = [255, 0, 0];
const green = [0, 255, 0];
const cyan = [0, 255, 255];
const purple = [255, 0, 255];
const white = [255, 255, 255];

const lightGreen = [128, 255, 128];
const darkGreen = [0, 176, 0];
const blue = [0, 0, 255];

const rainbow = [red, yellow, green, cyan, blue, purple, red];

const glow1Rs3 = [cyan, green, yellow, red, cyan];
const glow2Rs3 = [red, blue, purple, red];
const glow3Rs3 = [cyan, white, green, white, cyan];

const flash1Rs3 = [red, yellow];
const flash2Rs3 = [blue, cyan];
const flash3Rs3 = [darkGreen, lightGreen];

const glow1Osrs = [red, yellow, green, cyan, red];
const glow2Osrs = [red, purple, blue, red];
const glow3Osrs = [white, green, white, cyan, white];

const flash1Osrs = [red, yellow];
const flash2Osrs = [cyan, blue];
const flash3Osrs = [darkGreen, lightGreen];

const isAnimated = (color: Color, motion: Motion) => {
  return motion !== "none" || dynamicColors.includes(color);
};

export {
  blue,
  colors,
  cyan,
  darkGreen,
  effectsMap,
  flash1Osrs,
  flash1Rs3,
  flash2Osrs,
  flash2Rs3,
  flash3Osrs,
  flash3Rs3,
  glow1Osrs,
  glow1Rs3,
  glow2Osrs,
  glow2Rs3,
  glow3Osrs,
  glow3Rs3,
  green,
  isAnimated,
  lightGreen,
  motions,
  purple,
  red,
  white,
  yellow,
};
