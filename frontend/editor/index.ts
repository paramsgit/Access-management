import type { SerializedEditorState } from "lexical";

export { default as TextEditorComponent } from "./src/index";

export const defaultEditorJson: SerializedEditorState = {
  root: {
    children: [],
    direction: "ltr" as const,
    format: "",
    indent: 0,
    type: "root",
    version: 1,
  },
};
