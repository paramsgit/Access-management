import type { JSX } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
	NodeContextMenuOption,
	NodeContextMenuPlugin,
	NodeContextMenuSeparator,
} from "@lexical/react/LexicalNodeContextMenuPlugin";

import {
	$getSelection,
	$isDecoratorNode,
	$isNodeSelection,
	$isRangeSelection,
	COPY_COMMAND,
	CUT_COMMAND,
	PASTE_COMMAND,
	type LexicalNode,
} from "lexical";

import { $findMatchingParent } from "@lexical/utils";
import {
	$isTableCellNode,
	$insertTableRowAtSelection,
	$insertTableColumnAtSelection,
	$deleteTableRowAtSelection,
	$deleteTableColumnAtSelection,
	TableCellHeaderStates,
	$getTableCellNodeFromLexicalNode,
	$getTableRowIndexFromTableCellNode,
	$getTableColumnIndexFromTableCellNode,
	$getTableNodeFromLexicalNodeOrThrow,
	$computeTableMapSkipCellCheck,
	TableCellNode,
} from "@lexical/table";

import {
	Clipboard,
	ClipboardType,
	Copy,
	Link2Off,
	Scissors,
	Trash2,
	PlusSquare,
	SquareDashed,
	MinusSquare,
	Rows,
	Columns,
} from "lucide-react";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";

export default function ContextMenuPlugin(): JSX.Element {
	const [editor] = useLexicalComposerContext();

	const isInsideTable = (node: LexicalNode): boolean =>
		Boolean(
			$isTableCellNode(node) ||
				$findMatchingParent(node, (p) => $isTableCellNode(p)),
		);

	const items = [
		// ---- Link Actions ----
		new NodeContextMenuOption("Remove Link", {
			$onSelect: () => editor.dispatchCommand(TOGGLE_LINK_COMMAND, null),
			$showOn: (node) => $isLinkNode(node.getParent()),
			icon: <Link2Off className="h-4 w-4" />,
		}),

		new NodeContextMenuSeparator({
			$showOn: (node) => $isLinkNode(node.getParent()),
		}),

		// ---- Base Actions ----
		new NodeContextMenuOption("Cut", {
			$onSelect: () => editor.dispatchCommand(CUT_COMMAND, null),
			$showOn: (node) => !isInsideTable(node),
			icon: <Scissors className="h-4 w-4" />,
		}),

		new NodeContextMenuOption("Copy", {
			$onSelect: () => editor.dispatchCommand(COPY_COMMAND, null),
			$showOn: (node) => !isInsideTable(node),
			icon: <Copy className="h-4 w-4" />,
		}),

		new NodeContextMenuOption("Paste", {
			$onSelect: () => {
				navigator.clipboard.read().then(async () => {
					const text = await navigator.clipboard.readText();
					const data = new DataTransfer();
					data.setData("text/plain", text);
					editor.dispatchCommand(
						PASTE_COMMAND,
						new ClipboardEvent("paste", { clipboardData: data }),
					);
				});
			},
			$showOn: (node) => !isInsideTable(node),
			icon: <Clipboard className="h-4 w-4" />,
		}),

		new NodeContextMenuOption("Paste as Plain Text", {
			$onSelect: () => {
				navigator.clipboard.readText().then((text) => {
					const data = new DataTransfer();
					data.setData("text/plain", text);
					editor.dispatchCommand(
						PASTE_COMMAND,
						new ClipboardEvent("paste", { clipboardData: data }),
					);
				});
			},
			$showOn: (node) => !isInsideTable(node),
			icon: <ClipboardType className="h-4 w-4" />,
		}),

		// ---- Table Context Items ----
		new NodeContextMenuSeparator({
			$showOn: (node) => isInsideTable(node),
		}),

		new NodeContextMenuOption("Insert row above", {
			$onSelect: () => editor.update(() => $insertTableRowAtSelection(false)),
			$showOn: (node) => isInsideTable(node),
			icon: <Rows className="h-4 w-4" />,
		}),

		new NodeContextMenuOption("Insert row below", {
			$onSelect: () => editor.update(() => $insertTableRowAtSelection(true)),
			$showOn: (node) => isInsideTable(node),
			icon: <PlusSquare className="h-4 w-4" />,
		}),

		new NodeContextMenuOption("Insert column left", {
			$onSelect: () =>
				editor.update(() => $insertTableColumnAtSelection(false)),
			$showOn: (node) => isInsideTable(node),
			icon: <Columns className="h-4 w-4" />,
		}),

		new NodeContextMenuOption("Insert column right", {
			$onSelect: () => editor.update(() => $insertTableColumnAtSelection(true)),
			$showOn: (node) => isInsideTable(node),
			icon: <SquareDashed className="h-4 w-4" />,
		}),

		new NodeContextMenuSeparator({
			$showOn: (node) => isInsideTable(node),
		}),
		new NodeContextMenuOption("Toggle Row Header", {
			$onSelect: () => {
				editor.update(() => {
					const selection = $getSelection();
					if (!$isRangeSelection(selection)) return;

					const cell = $getTableCellNodeFromLexicalNode(
						selection.anchor.getNode(),
					);
					if (!cell) return;

					const table = $getTableNodeFromLexicalNodeOrThrow(cell);
					const rowIndex = $getTableRowIndexFromTableCellNode(cell);

					// Build grid map
					const [grid] = $computeTableMapSkipCellCheck(table, null, null);

					// Determine new style
					const current = cell.getHeaderStyles();
					const newStyle = current ^ TableCellHeaderStates.ROW;

					// Apply to all cells in row
					const rowCells = new Set<TableCellNode>();
					for (let col = 0; col < grid[rowIndex].length; col++) {
						const mapCell = grid[rowIndex][col];
						if (!mapCell?.cell) continue;

						if (!rowCells.has(mapCell.cell)) {
							rowCells.add(mapCell.cell);
							mapCell.cell.setHeaderStyles(newStyle, TableCellHeaderStates.ROW);
						}
					}
				});
			},

			icon: <Rows className="h-4 w-4" />,
			$showOn: (node) => isInsideTable(node),
		}),
		new NodeContextMenuOption("Toggle Column Header", {
			$onSelect: () => {
				editor.update(() => {
					const selection = $getSelection();
					if (!$isRangeSelection(selection)) return;

					const cell = $getTableCellNodeFromLexicalNode(
						selection.anchor.getNode(),
					);
					if (!cell) return;

					const table = $getTableNodeFromLexicalNodeOrThrow(cell);
					const columnIndex = $getTableColumnIndexFromTableCellNode(cell);

					// Build grid map
					const [grid] = $computeTableMapSkipCellCheck(table, null, null);

					// Determine new style value
					const current = cell.getHeaderStyles();
					const newStyle = current ^ TableCellHeaderStates.COLUMN;

					// Apply to entire column
					const columnCells = new Set<TableCellNode>();
					for (let row = 0; row < grid.length; row++) {
						const mapCell = grid[row][columnIndex];
						if (!mapCell?.cell) continue;

						if (!columnCells.has(mapCell.cell)) {
							columnCells.add(mapCell.cell);
							mapCell.cell.setHeaderStyles(
								newStyle,
								TableCellHeaderStates.COLUMN,
							);
						}
					}
				});
			},

			icon: <Columns className="h-4 w-4" />,
			$showOn: (node) => isInsideTable(node),
		}),

		new NodeContextMenuSeparator({
			$showOn: (node) => isInsideTable(node),
		}),

		new NodeContextMenuOption("Delete row", {
			$onSelect: () => editor.update(() => $deleteTableRowAtSelection()),
			$showOn: (node) => isInsideTable(node),
			icon: <MinusSquare className="h-4 w-4" />,
		}),

		new NodeContextMenuOption("Delete column", {
			$onSelect: () => editor.update(() => $deleteTableColumnAtSelection()),
			$showOn: (node) => isInsideTable(node),
			icon: <MinusSquare className="h-4 w-4" />,
		}),

		new NodeContextMenuSeparator(),
		new NodeContextMenuOption("Delete Node", {
			$onSelect: () => {
				const selection = $getSelection();
				if ($isRangeSelection(selection)) {
					const parents = selection.anchor.getNode().getParents();
					const target = parents[parents.length - 2];
					target?.remove();
				} else if ($isNodeSelection(selection)) {
					selection.getNodes().forEach((node) => {
						if ($isDecoratorNode(node)) node.remove();
					});
				}
			},
			// $showOn: (node) => !isInsideTable(node),
			icon: <Trash2 className="h-4 w-4" />,
		}),
	];

	return (
		<NodeContextMenuPlugin
			className="bg-white text-popover-foreground z-10000 overflow-hidden rounded-md border shadow-md"
			itemClassName="flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-gray-200"
			separatorClassName="bg-border -mx-1 h-px"
			items={items}
		/>
	);
}
