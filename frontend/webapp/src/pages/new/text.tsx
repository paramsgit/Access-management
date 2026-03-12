import React, { useState } from "react";
import { defaultEditorJson, TextEditorComponent } from "text-editor";

const TextEditorPage = () => {
  const [data, setData] = useState({
    json: defaultEditorJson,
  });
  return (
    <div>
      <TextEditorComponent editorState={data.json} setEditorState={setData} />
    </div>
  );
};

export default TextEditorPage;
