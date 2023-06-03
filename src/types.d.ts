type Options = {
  version?: Version;
  color?: Color;
  motion?: Motion;
  suffix?: string;
  replacement?: string;
  maxMessageLength?: number;
  scale?: number;
  fps?: number;
  cycleDuration?: number;
  quality?: number;
  debug?: boolean;
};

type Config = Required<Options> & {
  totalFrames: number;
  delayPerFrame: number;
};

const enum Version {
  Osrs = "osrs",
  Rs3 = "rs3",
}

const enum Color {
  Yellow = "yellow",
  Red = "red",
  Green = "green",
  Cyan = "cyan",
  Purple = "purple",
  White = "white",
  Glow1 = "glow1",
  Glow2 = "glow2",
  Glow3 = "glow3",
  Flash1 = "flash1",
  Flash2 = "flash2",
  Flash3 = "flash3",
}

const enum Motion {
  None = "none",
  Wave = "wave",
  Wave2 = "wave2",
  Shake = "shake",
  Scroll = "scroll",
  Slide = "slide",
}
