const staticColors = ["yellow", "red", "green", "cyan", "purple", "white"];
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

const glow1 = [cyan, green, yellow, red, cyan];
const glow2 = [red, blue, purple, red];
const glow3 = [cyan, white, green, white, cyan];

const isAnimated = (color, motion) => {
  return motion !== "none" || dynamicColors.includes(color);
};

module.exports = {
  colors,
  motions,
  effectsMap,
  yellow,
  red,
  green,
  cyan,
  purple,
  white,
  lightGreen,
  darkGreen,
  blue,
  glow1,
  glow2,
  glow3,
  isAnimated,
};
