import { Button } from "@/components/ui/button";
import { type Dispatch, type SetStateAction } from "react";
import { TextEditorComponent } from "text-editor";

interface TextEditorSectionProps {
  data: any;
  setData: Dispatch<SetStateAction<any>>;
}

const TextEditorSection: React.FC<TextEditorSectionProps> = ({
  data,
  setData,
}) => {
  return (
    <div className="flex flex-col gap-2 h-full">
      <div className="bg-white py-2 px-4 rounded-lg flex justify-between">
        Some bar
      </div>
      <TextEditorComponent
        editorState={data.json}
        setEditorState={setData}
        editorClassNames="h-full"
      />
    </div>
  );
};

export default TextEditorSection;
