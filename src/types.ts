import ColorEffect from "./classes/ColorEffect";
import Context from "./classes/Context";

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

type EffectsOptions =
  | {
      color?: Color;
      motion?: Motion;
      pattern?: [];
    }
  | {
      color?: Pattern;
      motion?: Motion;
      pattern?: NonEmptyArray<PatternCharacter>;
    };

type Options = EffectsOptions & {
  debug?: boolean;
  duration?: number;
  enforceCapitalization?: boolean;
  format?: Format;
  fps?: IntRange<1, 50>;
  hasShadow?: boolean;
  maxMessageLength?: number;
  replacement?: string;
  scale?: number;
  shadowColor?: string;
  suffix?: string;
  version?: Version;
};

type Config = Required<Options> & {
  delayPerFrame: number;
  totalFrames: number;
};

type RuneScapeTextResponse = {
  color: Color | Pattern;
  data: Uint8Array;
  extension: Extension;
  framesCount: number;
  height: number;
  message: string;
  motion: Motion;
  pattern: [] | NonEmptyArray<PatternCharacter>;
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
  | "rainbow"
  | "red"
  | "white"
  | "yellow";

type Pattern = "pattern";

type PatternCharacter =
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
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
  | "z";

type Motion = "none" | "scroll" | "shake" | "slide" | "wave" | "wave2";

type Format = "rgb444" | "rgb565" | "rgba4444";

type Extension = "gif";

type ContextFillInput = {
  colorEffect: ColorEffect;
  fragment: string;
  frame: number;
  index: number;
  x: number;
  y: number;
};

type ColorFunctionInput = {
  frame: number;
  index: number;
};

type MotionFunctionInput = {
  fragment: string;
  frame: number;
  lineCharacterIndex: number;
};

type SlideInput = {
  getY: (input: {
    ascent: number;
    frame: number;
    height: number;
    motionFrameIndex: number;
  }) => number;
};

type WaveInput = {
  amplitudeFactor: number;
  frameFactor: number;
  getWave: (input: { frame: number; wave: number }) => number;
  getX: (input: { displacement: number; width: number }) => number;
};

type RenderInput = {
  character?: string;
  context: Context;
  fragment: string;
  frame: number;
  index?: number;
  lineCharacterIndex?: number;
};

type RGB = [number, number, number];

type Coordinates = { x: number; y: number };

export {
  Color,
  ColorFunctionInput,
  Config,
  ContextFillInput,
  Coordinates,
  EffectsOptions,
  Extension,
  Format,
  IntRange,
  Motion,
  MotionFunctionInput,
  NonEmptyArray,
  Options,
  Pattern,
  PatternCharacter,
  RenderInput,
  RGB,
  RuneScapeTextResponse,
  SlideInput,
  Version,
  WaveInput,
};
