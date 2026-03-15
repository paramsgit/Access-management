import type { SerializedEditorState } from "lexical";
import "./App.css";
import {
  Editor,
  type customSerializedChange,
} from "./components/blocks/editor-x/editor";
type EditorPageProps = {
  editorState: SerializedEditorState;
  setEditorState: (value: customSerializedChange) => void;
  convertFilesToImageUrl?: (files: any) => Promise<any>;
  mentionsData?: { mentionName: string; label: string }[];
  useMentionLookupService?: (mentionString: string | null) => {
    mentionName: string;
    label: string;
  }[];
  isCompact?: boolean;
  readOnly?: boolean;
  editorClassNames?: string;
  html?: string;
};

export default function EditorPage({
  editorState,
  setEditorState,
  convertFilesToImageUrl,
  mentionsData,
  useMentionLookupService,
  isCompact,
  editorClassNames,
  html,
  readOnly,
}: EditorPageProps) {
  return (
    <Editor
      editorSerializedState={editorState}
      onSerializedChange={(value) => {
        setEditorState(value);
      }}
      convertFilesToImageUrl={convertFilesToImageUrl}
      mentionsData={mentionsData}
      useMentionLookupService={useMentionLookupService}
      isCompact={isCompact}
      editorClassNames={editorClassNames}
      html={html}
      readOnly={readOnly}
    />
  );
}
