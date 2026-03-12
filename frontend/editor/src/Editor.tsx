import React, { useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"; // if you wrap with LexicalComposer
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import {
	AutoLinkPlugin,
	createLinkMatcherWithRegExp,
} from "@lexical/react/LexicalAutoLinkPlugin";
import { useLexicalEditable } from "@lexical/react/useLexicalEditable";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { HeadingNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { LinkNode, AutoLinkNode } from "@lexical/link";

import { $getRoot, $isElementNode, $nodesOfType, ElementNode } from "lexical";
import type { EditorState, LexicalEditor, LexicalNode } from "lexical";

import { EditorTheme } from "../theme";
import { MentionNode } from "../plugins/MentionPlugin/MentionNode";
import { ImageNode } from "../plugins/ImagePlugin/ImageNode";
import { TablePlugin as NewTablePlugin } from "../plugins/TablePlugin/TablePlugin";
import MentionPlugin from "../plugins/MentionPlugin/MentionPlugin";
import ImagesPlugin from "../plugins/ImagePlugin/ImagePlugin";
import ToolbarPlugin from "./Toolbar";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { $isTableNode } from "../plugins/TablePlugin/TableNode";
import type { Cell } from "../plugins/TablePlugin/TableNode";
import { DraggableBlockPlugin } from "../plugins/DraggableBlockPlugin/DraggableBlock";

type EditorProps = {
	editorRef: React.MutableRefObject<LexicalEditor | null>;
	editState: boolean;
	setEditable?: React.Dispatch<React.SetStateAction<boolean>>;
	mentionsData?:
		| Array<{
				mentionName: string;
				label: string;
		  }>
		| false;
	useMentionLookupService?: (
		mentionString: string | null,
		mentionsData: Array<{
			mentionName: string;
			label: string;
		}>,
	) => Array<{
		mentionName: string;
		label: string;
	}>;
	convertFilesToImageUrl: (
		files: FileList | null,
	) => Promise<Array<string> | null>;
	onChangeCallback?: (editorRef: LexicalEditor | null, payload: any) => void;
	placeholderText?: string;
	htmlData?: string;
	hideToolbar?: boolean;
	showToolbarText?: boolean;
	uiContainer?: HTMLElement | null;
};

function Editor({
	editorRef,
	editState,
	setEditable,
	mentionsData = false,
	useMentionLookupService,
	convertFilesToImageUrl,
	onChangeCallback,
	placeholderText = "Start Typing...",
	htmlData,
	hideToolbar = false,
	showToolbarText = false,
	uiContainer,
}: EditorProps): React.ReactElement {
	const [editor] = useLexicalComposerContext();
	const isEditable = useLexicalEditable();
	const [floatingAnchorElem, setFloatingAnchorElem] =
		useState<HTMLDivElement | null>(null);

	const onRef = (_floatingAnchorElem: HTMLDivElement) => {
		if (_floatingAnchorElem !== null) {
			setFloatingAnchorElem(_floatingAnchorElem);
		}
	};

	useEffect(() => {
		if (setEditable) {
			editor.setEditable(editState);
		}
	}, [editState, editor, setEditable]);

	const placeholder = <div className="placeholder">{placeholderText}</div>;

	function getTextContent(rootNode: LexicalNode): string {
		let textContent = "";

		if ($isTableNode(rootNode)) {
			let tableContent = "";
			rootNode.__rows.forEach((row) => {
				let rowContent = "";
				row.cells.forEach((cell: Cell) => {
					rowContent += cell.text + " ";
				});
				tableContent += rowContent;
			});
			textContent += tableContent;
		} else if ($isElementNode(rootNode)) {
			const children = (rootNode as ElementNode).getChildren();
			for (const child of children) {
				if ($isElementNode(child) && !child.isInline()) {
					textContent += getTextContent(child) + " , ";
				} else {
					textContent += child.getTextContent();
				}
			}
		} else {
			textContent += rootNode.getTextContent();
		}

		return textContent;
	}

	function getCustomTextContent(): string[] {
		const rootNodes = $getRoot().getChildren();
		const rootTexts = rootNodes
			.map(getTextContent)
			.filter((text) => text !== "");
		return rootTexts;
	}

	const onChange = (_editorState: EditorState, _editor: LexicalEditor) => {
		_editor.update(() => {
			const payload: any = {};
			const htmlString = $generateHtmlFromNodes(_editor, null);
			payload["html"] = htmlString;
			payload["json"] = JSON.stringify(_editor.getEditorState());
			if (mentionsData) {
				payload["mentions"] = $nodesOfType(MentionNode);
			}
			payload["content"] = getCustomTextContent();
			onChangeCallback?.(editorRef.current, payload);
		});

		editorRef.current = _editor;

		return editorRef.current;
	};

	useEffect(() => {
		if (htmlData) {
			editor.update(() => {
				const parser = new DOMParser();
				const dom = parser.parseFromString(htmlData, "text/html");
				const nodes = $generateNodesFromDOM(editor, dom);
				const root = $getRoot();
				if (root.getFirstChild() !== null) {
					root.clear();
				}
				root.append(...nodes);
			});
		}
	}, [htmlData, editor]);

	const URL_REGEX =
		/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,}|http:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|http:\/\/www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|http:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|http:\/\/www\.[a-zA-Z0-9]+\.[^\s]{2,})/;
	const EMAIL_REGEX =
		/(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s]{1,})*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;

	const MATCHERS = [
		createLinkMatcherWithRegExp(URL_REGEX, (text) => {
			return text;
		}),
		createLinkMatcherWithRegExp(EMAIL_REGEX, (text) => {
			return `mailto:${text}`;
		}),
	];

	const cellEditorConfig = {
		namespace: "Table",
		nodes: [
			HeadingNode,
			ListNode,
			ListItemNode,
			LinkNode,
			AutoLinkNode,
			MentionNode,
			ImageNode,
		],
		onError: (error: Error) => {
			throw error;
		},
		theme: EditorTheme,
	};

	return (
		<>
			{isEditable && (
				<div className="editor-container">
					{hideToolbar === false && (
						<ToolbarPlugin
							convertFilesToImageUrl={convertFilesToImageUrl}
							setEditable={setEditable}
							showToolbarText={showToolbarText}
							uiContainer={uiContainer}
						/>
					)}

					<ListPlugin />

					<RichTextPlugin
						contentEditable={
							<div className="editor-scroller border border-gray-300">
								<div className="editor" ref={onRef}>
									<ContentEditable
										className="editor-contentEditable"
										onClick={(e) => e.stopPropagation()}
									/>
								</div>
							</div>
						}
						placeholder={placeholder}
						ErrorBoundary={LexicalErrorBoundary as any}
					/>

					<HistoryPlugin />
					<AutoLinkPlugin matchers={MATCHERS} />
					<TabIndentationPlugin />
					<ImagesPlugin />

					{mentionsData && (
						<MentionPlugin
							mentionsData={mentionsData}
							useMentionLookupService={useMentionLookupService}
						/>
					)}

					<NewTablePlugin cellEditorConfig={cellEditorConfig}>
						<RichTextPlugin
							contentEditable={
								<ContentEditable
									className="TableNode__contentEditable"
									onClick={(e) => e.stopPropagation()}
								/>
							}
							placeholder={null}
							ErrorBoundary={LexicalErrorBoundary as any}
						/>
						<HistoryPlugin />
						<AutoFocusPlugin />
					</NewTablePlugin>

					{floatingAnchorElem && (
						<DraggableBlockPlugin anchorElem={floatingAnchorElem} />
					)}

					<OnChangePlugin onChange={onChange} />
				</div>
			)}
		</>
	);
}

export default Editor;
