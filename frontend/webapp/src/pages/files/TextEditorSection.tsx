import { type Dispatch, type SetStateAction } from "react";
import { TextEditorComponent } from "text-editor";

interface TextEditorSectionProps {
  data: any;
  setData: Dispatch<SetStateAction<any>>;
  readOnly: boolean;
}

const TextEditorSection: React.FC<TextEditorSectionProps> = ({
  data,
  setData,
  readOnly,
}) => {
  return (
    <div className="flex flex-col gap-2 h-full">
      <TextEditorComponent
        editorState={data.json}
        setEditorState={setData}
        editorClassNames="h-full"
        readOnly={readOnly}
      />
    </div>
  );
};

export default TextEditorSection;
