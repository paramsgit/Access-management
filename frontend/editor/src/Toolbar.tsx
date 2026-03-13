import React from "react";
import {
	$isListNode,
	INSERT_UNORDERED_LIST_COMMAND,
	INSERT_ORDERED_LIST_COMMAND,
	ListNode,
	REMOVE_LIST_COMMAND,
} from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
	$getSelectionStyleValueForProperty,
	$patchStyleText,
} from "@lexical/selection";
import {
	$findMatchingParent,
	$getNearestNodeOfType,
	mergeRegister,
} from "@lexical/utils";
import {
	$getSelection,
	$isRangeSelection,
	$isRootOrShadowRoot,
	CAN_REDO_COMMAND,
	CAN_UNDO_COMMAND,
	COMMAND_PRIORITY_CRITICAL,
	FORMAT_TEXT_COMMAND,
	REDO_COMMAND,
	SELECTION_CHANGE_COMMAND,
	UNDO_COMMAND,
} from "lexical";
import type { LexicalEditor } from "lexical";
import { useCallback, useEffect, useState } from "react";
import DropdownColorPicker from "./DropdownColorPicker";

import useModal from "../utils/useModal";
import { InsertNewTableDialog } from "../plugins/TablePlugin/TablePlugin";
import { InsertImageDialog } from "../plugins/ImagePlugin/ImagePlugin";
import {
	BgColor,
	BoldIcon,
	BulletListIcon,
	FontColor,
	ImageIcon,
	ItalicIcon,
	NumberedListIcon,
	RedoIcon,
	SaveIcon,
	TableIcon,
	UnderlineIcon,
	UndoIcon,
} from "../icons";

const blockTypeToBlockName = {
	bullet: "Bulleted List",
	paragraph: "Normal",
	number: "Numbered List",
};

function buttonActiveClass(active: boolean) {
	if (active) return "active dropdown-item-active";
	else return "";
}

function BlockTextFormat({
	editor,
	blockType,
	disabled = false,
	showToolbarText,
}: {
	blockType: keyof typeof blockTypeToBlockName;
	editor: LexicalEditor;
	disabled?: boolean;
	showToolbarText?: boolean;
}): React.ReactElement {
	const formatBulletList = () => {
		if (blockType !== "bullet") {
			editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
		} else {
			editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
		}
	};

	const formatNumberedList = () => {
		if (blockType !== "number") {
			editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
		} else {
			editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
		}
	};

	return (
		<>
			<button
				disabled={disabled}
				className={"toolbar-item " + buttonActiveClass(blockType === "bullet")}
				onClick={formatBulletList}
			>
				<i className="icon ">
					<BulletListIcon />
				</i>
				{showToolbarText && <span className="text">Bullet List</span>}
			</button>
			<button
				disabled={disabled}
				className={"toolbar-item " + buttonActiveClass(blockType === "number")}
				onClick={formatNumberedList}
			>
				<i className="icon ">
					<NumberedListIcon />
				</i>
				{showToolbarText && <span className="text">Numbered List</span>}
			</button>
		</>
	);
}

function Divider(): React.ReactElement {
	return <div className="divider" />;
}

export default function ToolbarPlugin({
	convertFilesToImageUrl,
	setEditable,
	showToolbarText,
	uiContainer,
}: {
	convertFilesToImageUrl: (
		files: FileList | null,
	) => Promise<Array<string> | null>;
	setEditable?: React.Dispatch<React.SetStateAction<boolean>>;
	showToolbarText: boolean;
	uiContainer?: HTMLElement | null;
}): React.ReactElement {
	const [editor] = useLexicalComposerContext();
	const [activeEditor, setActiveEditor] = useState(editor);
	const [blockType, setBlockType] =
		useState<keyof typeof blockTypeToBlockName>("paragraph");

	const [isBold, setIsBold] = useState(false);
	const [isItalic, setIsItalic] = useState(false);
	const [isUnderline, setIsUnderline] = useState(false);
	const [fontColor, setFontColor] = useState("#000000");
	const [bgColor, setBgColor] = useState<string>("#fff");
	const [canUndo, setCanUndo] = useState(false);
	const [canRedo, setCanRedo] = useState(false);
	const [modal, showModal] = useModal();

	const $updateToolbar = useCallback(() => {
		const selection = $getSelection();
		if ($isRangeSelection(selection)) {
			const anchorNode = selection.anchor.getNode();
			let element =
				anchorNode.getKey() === "root"
					? anchorNode
					: $findMatchingParent(anchorNode, (e) => {
							const parent = e.getParent();
							return parent !== null && $isRootOrShadowRoot(parent);
						});

			if (element === null) {
				element = anchorNode.getTopLevelElementOrThrow();
			}

			const elementKey = element.getKey();
			const elementDOM = activeEditor.getElementByKey(elementKey);

			setIsBold(selection.hasFormat("bold"));
			setIsItalic(selection.hasFormat("italic"));
			setIsUnderline(selection.hasFormat("underline"));

			setFontColor(
				$getSelectionStyleValueForProperty(selection, "color", "#000"),
			);
			setBgColor(
				$getSelectionStyleValueForProperty(
					selection,
					"background-color",
					"#fff",
				),
			);

			if (elementDOM !== null) {
				if ($isListNode(element)) {
					const parentList = $getNearestNodeOfType<ListNode>(
						anchorNode,
						ListNode,
					);
					const type: any = parentList
						? parentList.getListType()
						: element.getListType();
					setBlockType(type);
				} else {
					const type = element.getType();
					if (type in blockTypeToBlockName) {
						setBlockType(type as keyof typeof blockTypeToBlockName);
					}
				}
			}
		}
	}, [activeEditor]);

	const applyStyleText = useCallback(
		(styles: Record<string, string>, skipHistoryStack?: boolean) => {
			activeEditor.update(
				() => {
					const selection = $getSelection();
					if (selection !== null) {
						if ("anchor" in selection && "focus" in selection) {
							$patchStyleText(selection, styles);
						} else {
							console.warn(
								"Unsupported selection type for applying styles:",
								selection,
							);
						}
					}
				},
				skipHistoryStack ? { tag: "historic" } : {},
			);
		},
		[activeEditor],
	);

	const onFontColorSelect = useCallback(
		(value: string, skipHistoryStack: boolean) => {
			applyStyleText({ color: value }, skipHistoryStack);
		},
		[applyStyleText],
	);

	const onBgColorSelect = useCallback(
		(value: string, skipHistoryStack: boolean) => {
			applyStyleText({ "background-color": value }, skipHistoryStack);
		},
		[applyStyleText],
	);

	useEffect(() => {
		return editor.registerCommand(
			SELECTION_CHANGE_COMMAND,
			(_payload, newEditor) => {
				$updateToolbar();
				setActiveEditor(newEditor);
				return false;
			},
			COMMAND_PRIORITY_CRITICAL,
		);
	}, [editor, $updateToolbar]);

	useEffect(() => {
		return mergeRegister(
			editor.registerEditableListener((editable) => {
				setEditable && setEditable(editable);
			}),
			activeEditor.registerUpdateListener(({ editorState }) => {
				editorState.read(() => {
					$updateToolbar();
				});
			}),
			activeEditor.registerCommand<boolean>(
				CAN_UNDO_COMMAND,
				(payload) => {
					setCanUndo(payload);
					return false;
				},
				COMMAND_PRIORITY_CRITICAL,
			),
			activeEditor.registerCommand<boolean>(
				CAN_REDO_COMMAND,
				(payload) => {
					setCanRedo(payload);
					return false;
				},
				COMMAND_PRIORITY_CRITICAL,
			),
		);
	}, [$updateToolbar, activeEditor, editor]);

	return (
		<div className="toolbar__wrapper">
			<div className="toolbar">
				<button
					disabled={!canUndo || !editor.isEditable()}
					onClick={() => {
						activeEditor.dispatchCommand(UNDO_COMMAND, undefined);
					}}
					className="toolbar-item spaced"
					aria-label="Undo"
				>
					<i className="format ">
						<UndoIcon />
					</i>
				</button>
				<button
					disabled={!canRedo || !editor.isEditable()}
					onClick={() => {
						activeEditor.dispatchCommand(REDO_COMMAND, undefined);
					}}
					className="toolbar-item spaced"
					aria-label="Redo"
				>
					<i className="format ">
						<RedoIcon />
					</i>
				</button>
				<Divider />
				{blockType in blockTypeToBlockName && activeEditor === editor && (
					<>
						<BlockTextFormat
							blockType={blockType}
							editor={editor}
							disabled={!editor.isEditable()}
							showToolbarText={showToolbarText}
						/>
						<Divider />
					</>
				)}
				<button
					disabled={!editor.isEditable()}
					onClick={() => {
						activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
					}}
					className={"toolbar-item spaced " + (isBold ? "active" : "")}
					aria-label={`Format text as bold`}
				>
					<i className="format ">
						<BoldIcon />
					</i>
				</button>
				<button
					disabled={!editor.isEditable()}
					onClick={() => {
						activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
					}}
					className={"toolbar-item spaced " + (isItalic ? "active" : "")}
					aria-label={`Format text as Italic`}
				>
					<i className="format ">
						<ItalicIcon />
					</i>
				</button>
				<button
					disabled={!editor.isEditable()}
					onClick={() => {
						activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
					}}
					className={"toolbar-item spaced " + (isUnderline ? "active" : "")}
					aria-label={`Format text with underline`}
				>
					<i className="format ">
						<UnderlineIcon />
					</i>
				</button>
				<Divider />
				<button
					disabled={!editor.isEditable() || activeEditor !== editor}
					className="toolbar-item"
					onClick={() => {
						showModal(
							"Insert Table",
							(onClose) => (
								<InsertNewTableDialog
									activeEditor={activeEditor}
									onClose={onClose}
								/>
							),
							uiContainer,
						);
					}}
				>
					<i className="icon ">
						<TableIcon />
					</i>
					{showToolbarText && <span className="text">Table</span>}
				</button>
				<Divider />
				<button
					disabled={!editor.isEditable() || activeEditor !== editor}
					className="toolbar-item"
					onClick={() => {
						showModal(
							"Insert Image",
							(onClose) => (
								<InsertImageDialog
									activeEditor={activeEditor}
									onClose={onClose}
									convertFilesToImageUrl={convertFilesToImageUrl}
								/>
							),
							uiContainer,
						);
					}}
				>
					<i className="icon ">
						<ImageIcon />
					</i>
					{showToolbarText && <span className="text">Image</span>}
				</button>
				<Divider />
				<DropdownColorPicker
					disabled={!editor.isEditable()}
					buttonClassName="toolbar-item color-picker"
					buttonAriaLabel="Formatting text color"
					buttonIconClassName="icon font-color"
					color={fontColor}
					onChange={onFontColorSelect}
					title="text color"
					icon={<FontColor />}
					uiContainer={uiContainer}
				/>
				<DropdownColorPicker
					disabled={!editor.isEditable()}
					buttonClassName="toolbar-item color-picker"
					buttonAriaLabel="Formatting background color"
					buttonIconClassName="icon bg-color"
					color={bgColor}
					onChange={onBgColorSelect}
					title="bg color"
					icon={<BgColor />}
					uiContainer={uiContainer}
				/>
			</div>
			{setEditable && (
				<div className="toolbar">
					<button
						disabled={!editor.isEditable()}
						className="toolbar-item"
						onClick={() => {
							setEditable && setEditable(false);
						}}
					>
						<i className="icon ">
							<SaveIcon />
						</i>
						{showToolbarText && <span className="text">Save</span>}
					</button>
				</div>
			)}
			{modal}
		</div>
	);
}
