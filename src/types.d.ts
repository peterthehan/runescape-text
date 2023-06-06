// https://stackoverflow.com/questions/39494689/is-it-possible-to-restrict-number-to-a-certain-range
type Enumerate<
  N extends number,
  Acc extends number[] = []
> = Acc["length"] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc["length"]]>;
type IntRange<F extends number, T extends number> =
  | Exclude<Enumerate<T>, Enumerate<F>>
  | T;

// https://stackoverflow.com/questions/56006111/is-it-possible-to-define-a-non-empty-array-type-in-typescript
type NonEmptyArray<T> = [T, ...T[]];

type Options = {
  color?: Color;
  debug?: boolean;
  duration?: number;
  enforceCapitalization?: boolean;
  format?: Format;
  fps?: IntRange<1, 50>;
  hasShadow?: boolean;
  maxMessageLength?: number;
  motion?: Motion;
  pattern?: [];
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
  extension: "gif";
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
  | "purple"
  | "red"
  | "white"
  | "yellow";

type Motion = "none" | "scroll" | "shake" | "slide" | "wave" | "wave2";

type Format = "rgb444" | "rgb565" | "rgba4444";
