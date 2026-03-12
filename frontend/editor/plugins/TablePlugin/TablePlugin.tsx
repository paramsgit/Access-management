import React, {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import {
	$createParagraphNode,
	$insertNodes,
	COMMAND_PRIORITY_EDITOR,
	createCommand,
} from "lexical";
import type {
	EditorThemeClasses,
	Klass,
	LexicalCommand,
	LexicalEditor,
	LexicalNode,
} from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { $createTableNodeWithDimensions, TableNode } from "./TableNode";

function invariant(cond?: boolean, message?: string): asserts cond {
	if (cond) {
		return;
	}
	throw new Error(
		"Internal Lexical error: invariant() is meant to be replaced at compile " +
			"time. There is no runtime version. Error: " +
			message,
	);
}

export type InsertTableCommandPayload = Readonly<{
	columns: string;
	rows: string;
	includeHeaders?: boolean;
}>;

export type CellContextShape = {
	cellEditorConfig: null | CellEditorConfig;
	cellEditorPlugins: null | React.ReactNode;
	uiContainer?: HTMLElement | null;
	set: (
		cellEditorConfig: null | CellEditorConfig,
		cellEditorPlugins: null | React.ReactNode,
	) => void;
};

export type CellEditorConfig = Readonly<{
	namespace: string;
	nodes?: ReadonlyArray<Klass<LexicalNode>>;
	onError: (error: Error, editor: LexicalEditor) => void;
	readOnly?: boolean;
	theme?: EditorThemeClasses;
}>;

export const INSERT_NEW_TABLE_COMMAND: LexicalCommand<InsertTableCommandPayload> =
	createCommand("INSERT_NEW_TABLE_COMMAND");

export const CellContext = createContext<CellContextShape>({
	cellEditorConfig: null,
	cellEditorPlugins: null,
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	set: () => {},
});

export function TableContext({
	children,
	uiContainer,
}: {
	children: React.ReactNode;
	uiContainer?: HTMLElement | null;
}) {
	const [contextValue, setContextValue] = useState<{
		cellEditorConfig: null | CellEditorConfig;
		cellEditorPlugins: null | React.ReactNode;
		uiContainer?: HTMLElement | null;
	}>({
		cellEditorConfig: null,
		cellEditorPlugins: null,
		uiContainer,
	});
	return (
		<CellContext.Provider
			value={useMemo(
				() => ({
					cellEditorConfig: contextValue.cellEditorConfig,
					cellEditorPlugins: contextValue.cellEditorPlugins,
					uiContainer: contextValue.uiContainer,
					set: (cellEditorConfig, cellEditorPlugins) => {
						setContextValue({
							cellEditorConfig,
							cellEditorPlugins,
							uiContainer,
						});
					},
				}),
				[
					contextValue.cellEditorConfig,
					contextValue.cellEditorPlugins,
					contextValue.uiContainer,
					uiContainer,
				],
			)}
		>
			{children}
		</CellContext.Provider>
	);
}

export function InsertNewTableDialog({
	activeEditor,
	onClose,
}: {
	activeEditor: LexicalEditor;
	onClose: () => void;
}): React.ReactElement {
	const [rows, setRows] = useState("5");
	const [columns, setColumns] = useState("5");
	const [isDisabled, setIsDisabled] = useState(true);

	useEffect(() => {
		const row = Number(rows);
		const column = Number(columns);
		if (row && row > 0 && row <= 500 && column && column > 0 && column <= 50) {
			setIsDisabled(false);
		} else {
			setIsDisabled(true);
		}
	}, [rows, columns]);

	const onClick = () => {
		activeEditor.dispatchCommand(INSERT_NEW_TABLE_COMMAND, { columns, rows });
		onClose();
	};

	return (
		<>
			<div className="Input__wrapper">
				<label className="Input__label">Rows</label>
				<input
					type="number"
					className="Input__input"
					placeholder="# of rows (1-500)"
					value={rows}
					onChange={(e) => {
						setRows(e.target.value);
					}}
					data-test-id="table-modal-rows"
				/>
			</div>
			<div className="Input__wrapper">
				<label className="Input__label">Columns</label>
				<input
					type="number"
					className="Input__input"
					placeholder="# of rows (1-50)"
					value={columns}
					onChange={(e) => {
						setColumns(e.target.value);
					}}
					data-test-id="table-modal-columns"
				/>
			</div>
			<div
				className="flex justify-end mt-5"
				data-test-id="table-model-confirm-insert"
			>
				<button className="button" disabled={isDisabled} onClick={onClick}>
					Confirm
				</button>
			</div>
		</>
	);
}

export function TablePlugin({
	cellEditorConfig,
	children,
}: {
	cellEditorConfig: CellEditorConfig;
	children: React.ReactNode;
}): React.ReactElement | null {
	const [editor] = useLexicalComposerContext();
	const cellContext = useContext(CellContext);

	useEffect(() => {
		if (!editor.hasNodes([TableNode])) {
			invariant(false, "TablePlugin: TableNode is not registered on editor");
		}

		cellContext.set(cellEditorConfig, children);

		return editor.registerCommand<InsertTableCommandPayload>(
			INSERT_NEW_TABLE_COMMAND,
			({ columns, rows, includeHeaders }) => {
				const tableNode = $createTableNodeWithDimensions(
					Number(rows),
					Number(columns),
					includeHeaders,
				);
				$insertNodes([tableNode, $createParagraphNode()]);
				return true;
			},
			COMMAND_PRIORITY_EDITOR,
		);
	}, [cellContext, cellEditorConfig, children, editor]);

	return null;
}
