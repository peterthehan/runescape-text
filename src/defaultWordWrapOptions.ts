import wrap from "word-wrap";

export const defaultWordWrapOptions: wrap.IOptions = {
  width: 50,
  indent: "",
  newline: "\n",
  escape: (str: string) => str.trimEnd(),
  trim: false,
  cut: false,
};
