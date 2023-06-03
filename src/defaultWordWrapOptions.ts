import wrap from "word-wrap";

export const defaultWordWrapOptions: wrap.IOptions = {
  cut: false,
  escape: (str: string) => str.trimEnd(),
  indent: "",
  newline: "\n",
  trim: false,
  width: 50,
};
