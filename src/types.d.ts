type Enumerate<
  N extends number,
  Acc extends number[] = []
> = Acc["length"] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc["length"]]>;

type IntRange<F extends number, T extends number> =
  | Exclude<Enumerate<T>, Enumerate<F>>
  | T;

type Options = {
  color?: Color;
  debug?: boolean;
  duration?: number;
  enforceCapitalization?: boolean;
  format?: Format;
  fps?: IntRange<1, 50>;
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

type RuneScapeTextResponse = {
  data: Uint8Array;
  extension: string;
  framesCount: number;
  height: number;
  width: number;
};

type Version = "osrs" | "rs3";

type Color =
  | "cyan"
  | "flash1"
  | "flash2"
  | "flash3"
  | "glow1"
  | "glow2"
  | "glow3"
  | "green"
  | "pattern"
  | "purple"
  | "rainbow"
  | "red"
  | "white"
  | "yellow";

type ColorPattern =
  | "a"
  | "b"
  | "c"
  | "d"
  | "e"
  | "f"
  | "g"
  | "h"
  | "i"
  | "j"
  | "k"
  | "l"
  | "m"
  | "n"
  | "o"
  | "p"
  | "q"
  | "r"
  | "s"
  | "t"
  | "u"
  | "v"
  | "w"
  | "x"
  | "y"
  | "z"
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9";

type Motion = "none" | "scroll" | "shake" | "slide" | "wave" | "wave2";

type Format = "rgb444" | "rgb565" | "rgba4444";
