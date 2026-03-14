import { useParams } from "react-router-dom";
import { useFile, useUpdateFileContent } from "@/hooks/useFile";
import { useEffect, useState } from "react";
import TextEditorSection from "./TextEditorSection";
import { Button } from "@/components/ui/button";
import { defaultLexicalJson } from "text-editor/src/lib/helper";

const FileDetailsPage = () => {
  const { id } = useParams();
  const { data: file, isLoading } = useFile(id!, "content");
  const { mutate: updateFile } = useUpdateFileContent();
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState({
    json: file?.content?.data,
  });

  const handleSave = async () => {
    console.log("--->", data);
    if (!updateFile || !id || !data?.json) {
      return;
    }
    updateFile({ id, data: data?.json });
  };

  useEffect(() => {
    setData({ json: file?.content?.data });
  }, [file]);

  if (isLoading) {
    return <>Loading...</>;
  }

  return (
    <div>
      <div className="flex flex-wrap justify-between w-full items-center">
        <h1>Name : {file?.fileName}</h1>
        <Button
          onClick={() => {
            if (isEditing) {
              handleSave();
            }

            setIsEditing((prev) => !prev);
          }}
        >
          {isEditing ? "Save" : "Edit"}
        </Button>
      </div>
      <div></div>
      {isEditing && (
        <div>
          <TextEditorSection data={data} setData={setData} />
        </div>
      )}
    </div>
  );
};

export default FileDetailsPage;
