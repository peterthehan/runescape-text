type Format = "rgb444" | "rgb565" | "rgba4444";

type Options = {
  color?: Color;
  cycleDuration?: number;
  debug?: boolean;
  format?: Format;
  fps?: number;
  maxMessageLength?: number;
  motion?: Motion;
  replacement?: string;
  scale?: number;
  suffix?: string;
  version?: Version;
};

type Config = Required<Options> & {
  delayPerFrame: number;
  totalFrames: number;
};

const enum Version {
  Osrs = "osrs",
  Rs3 = "rs3",
}

const enum Color {
  Cyan = "cyan",
  Flash1 = "flash1",
  Flash2 = "flash2",
  Flash3 = "flash3",
  Glow1 = "glow1",
  Glow2 = "glow2",
  Glow3 = "glow3",
  Green = "green",
  Purple = "purple",
  Red = "red",
  White = "white",
  Yellow = "yellow",
}

const enum Motion {
  None = "none",
  Scroll = "scroll",
  Shake = "shake",
  Slide = "slide",
  Wave = "wave",
  Wave2 = "wave2",
}
