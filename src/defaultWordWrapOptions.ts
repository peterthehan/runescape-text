import wrap from "word-wrap";

export const defaultWordWrapOptions: wrap.IOptions = {
  cut: false,
  escape: (string: string) => string.trim(),
  indent: "",
  newline: "\n",
  trim: false,
  width: 80,
};
