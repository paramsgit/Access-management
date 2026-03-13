import { LexicalComposer } from "@lexical/react/LexicalComposer";
import type { InitialConfigType } from "@lexical/react/LexicalComposer";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import {
  $getRoot,
  $isElementNode,
  type EditorState,
  type LexicalNode,
  type SerializedEditorState,
} from "lexical";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { editorTheme } from "../../editor/themes/editor-theme";
import { TooltipProvider } from "../../ui/tooltip";
import { nodes } from "./nodes";
import { Plugins } from "./plugins";
import { $isTableNode } from "@lexical/table";
import { MentionNode } from "../../editor/nodes/mention-node";
import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { deepEqual, defaultLexicalJson } from "../../../lib/helper";

const editorConfig: InitialConfigType = {
  namespace: "Editor",
  theme: editorTheme,
  nodes,
  onError: (error: Error) => {
    console.error(error);
  },
};

export interface customSerializedChange {
  json: SerializedEditorState;
  html: string;
  text: string;
  mentions?: any;
}

function SmartInitializer({
  html,
  editorSerializedState,
  defaultJson,
  deepEqual,
}: {
  html?: string;
  editorSerializedState?: any;
  defaultJson: any;
  deepEqual: (a: any, b: any) => boolean;
}) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor) return;

    const isDefault =
      !editorSerializedState || deepEqual(editorSerializedState, defaultJson);

    if (editorSerializedState && !isDefault) return;

    if (isDefault && html) {
      editor.update(() => {
        const parser = new DOMParser();
        const dom = parser.parseFromString(html, "text/html");
        const nodes = $generateNodesFromDOM(editor, dom);

        const root = $getRoot();
        root.clear();
        nodes.forEach((n) => root.append(n));
      });
    }
  }, [editor, html, editorSerializedState, defaultJson, deepEqual]);

  return null;
}

export function Editor({
  editorState,
  editorSerializedState,
  onChange,
  onSerializedChange,
  convertFilesToImageUrl,
  mentionsData,
  useMentionLookupService,
  isCompact,
  editorClassNames,
  html,
}: {
  editorState?: EditorState;
  editorSerializedState?: SerializedEditorState;
  onChange?: (editorState: EditorState) => void;
  onSerializedChange?: (editorSerializedState: customSerializedChange) => void;
  convertFilesToImageUrl?: (files: any) => Promise<any>;
  mentionsData?: { mentionName: string; label: string }[];
  useMentionLookupService?: (
    mentionString: string | null,
    usersList?: { mentionName: string; label: string }[],
  ) => {
    mentionName: string;
    label: string;
  }[];
  isCompact?: boolean;
  editorClassNames?: string;
  html?: string;
}) {
  function getTextContentFromNode(node: LexicalNode): string {
    if ($isTableNode(node)) {
      // Extract table text row by row
      return node
        .getChildren() // rows
        .map((row) => $rowToText(row))
        .join("\n");
    }

    // If element (block)
    if ($isElementNode(node)) {
      return node
        .getChildren()
        .map((child) => getTextContentFromNode(child))
        .join(" ");
    }

    // Text node or other nodes
    return node.getTextContent();
  }

  function $rowToText(rowNode: LexicalNode): string {
    if (!$isElementNode(rowNode)) return "";

    return rowNode
      .getChildren() // cells
      .map((cell) => cell.getTextContent())
      .join(" | ");
  }

  function getCustomTextContent(): string[] {
    const root = $getRoot();
    return root
      .getChildren()
      .map((node) => getTextContentFromNode(node))
      .map((text) => text.trim())
      .filter(Boolean);
  }
  function getAllNodesOfType<T extends LexicalNode>(
    root: LexicalNode,
    predicate: (n: LexicalNode) => n is T,
  ): T[] {
    const acc: T[] = [];
    function rec(node: LexicalNode) {
      if (predicate(node)) {
        acc.push(node);
      }
      if ($isElementNode(node)) {
        node.getChildren().forEach(rec);
      }
    }
    rec(root);
    return acc;
  }

  return (
    <div className={"bg-white overflow-hidden rounded-lg border  h-full"}>
      <LexicalComposer
        initialConfig={{
          ...editorConfig,
          ...(editorState ? { editorState } : {}),
          ...(editorSerializedState
            ? { editorState: JSON.stringify(editorSerializedState) }
            : {}),
        }}
      >
        <TooltipProvider>
          <Plugins
            convertFilesToImageUrl={convertFilesToImageUrl}
            mentionsData={mentionsData}
            useMentionLookupService={useMentionLookupService}
            isCompact={isCompact}
            editorClassNames={editorClassNames}
          />

          <SmartInitializer
            html={html}
            editorSerializedState={editorSerializedState}
            defaultJson={defaultLexicalJson()}
            deepEqual={deepEqual}
          />

          <OnChangePlugin
            ignoreSelectionChange={true}
            onChange={(editorState, editor) => {
              const json = editorState.toJSON();
              const html = editorState.read(() => {
                return $generateHtmlFromNodes(editor, null);
              });
              const text = editorState.read(() => getCustomTextContent());
              const data: customSerializedChange = {
                html,
                json,
                text: text?.[0],
              };
              if (mentionsData) {
                const mentions = editorState.read(() => {
                  const nodes = getAllNodesOfType(
                    $getRoot(),
                    (n): n is MentionNode => n instanceof MentionNode,
                  );
                  return nodes.map((node) => node.getPayload());
                });

                data.mentions = mentions;
              }
              onChange?.(editorState);
              onSerializedChange?.(data);
            }}
          />
        </TooltipProvider>
      </LexicalComposer>
    </div>
  );
}
