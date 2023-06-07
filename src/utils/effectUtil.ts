const staticColors = [
  "yellow",
  "red",
  "green",
  "cyan",
  "purple",
  "white",
  "rainbow",
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

const isAnimated = (color: Color | Pattern, motion: Motion) => {
  return motion !== "none" || dynamicColors.includes(color);
};

export { colors, effectsMap, isAnimated, motions };
