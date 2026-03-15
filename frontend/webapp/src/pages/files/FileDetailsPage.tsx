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
  const [readOnly, setReadOnly] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [disableClose, setDisableClose] = useState(false);
  const [data, setData] = useState<{ json: any } | null>(null);

  const handleSave = async () => {
    setDisableClose(false);

    if (!updateFile || !id || !data?.json) {
      return;
    }
    updateFile({ id, data: data?.json });
  };

  useEffect(() => {
    setData({ json: file?.content?.data });
  }, [file]);

  useEffect(() => {
    if (data && !isEditing) {
      setTimeout(() => {
        setIsEditing(true);
      }, 100);
    }
  }, [data]);

  useEffect(() => {
    if (!data?.json || readOnly) return;
    setDisableClose(true);
    const timer = setTimeout(() => {
      handleSave();
    }, 1000);

    return () => clearTimeout(timer);
  }, [data]);

  if (isLoading) {
    return <>Loading...</>;
  }

  return (
    <div className="h-full flex flex-col gap-2">
      <div className="flex flex-wrap justify-between w-full items-center">
        <h1 className="text-lg font-semibold"> {file?.fileName}</h1>
        <Button
          disabled={disableClose}
          onClick={() => {
            setReadOnly((prev) => !prev);
          }}
        >
          {!readOnly ? "Close" : "Edit"}
        </Button>
      </div>

      {isEditing && data && (
        <div className="flex-1">
          <TextEditorSection
            key={file?.id}
            data={data}
            setData={setData}
            readOnly={readOnly}
          />
        </div>
      )}
    </div>
  );
};

export default FileDetailsPage;
