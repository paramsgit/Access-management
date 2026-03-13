export { default as TextEditorComponent } from "./src/index";

export const defaultEditorJson: any = {
  root: {
    children: [
      {
        children: [],
        direction: "ltr" as const,
        format: "",
        indent: 0,
        type: "paragraph",
        version: 1,
      },
    ],
    direction: "ltr" as const,
    format: "",
    indent: 0,
    type: "root",
    version: 1,
  },
};
