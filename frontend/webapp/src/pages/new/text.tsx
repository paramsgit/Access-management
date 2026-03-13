import { useState } from "react";
import { defaultEditorJson, TextEditorComponent } from "text-editor";

const TextEditorPage = () => {
  const [data, setData] = useState({
    json: defaultEditorJson,
  });
  return (
    <div className="flex flex-col gap-2 h-full">
      <div className="bg-white py-2 px-4 rounded-lg">Some bar</div>
      <TextEditorComponent
        editorState={data.json}
        setEditorState={setData}
        editorClassNames="h-full"
      />
    </div>
  );
};

export default TextEditorPage;
