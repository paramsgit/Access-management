import type { JSX } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
	NodeContextMenuOption,
	NodeContextMenuPlugin,
	NodeContextMenuSeparator,
} from "@lexical/react/LexicalNodeContextMenuPlugin";

import {
	$insertTableRowAtSelection,
	$insertTableColumnAtSelection,
	$deleteTableRowAtSelection,
	$deleteTableColumnAtSelection,
	$isTableCellNode,
} from "@lexical/table";

import { $getSelection, $isRangeSelection, type LexicalNode } from "lexical";
import { $findMatchingParent } from "@lexical/utils";

import {
	PlusSquare,
	SquareDashed,
	MinusSquare,
	Rows,
	Columns,
} from "lucide-react";

export default function TableContextMenuPlugin(): JSX.Element {
	const [editor] = useLexicalComposerContext();

	const isInsideCell = (node: LexicalNode): boolean =>
		Boolean(
			$isTableCellNode(node) ||
				$findMatchingParent(node, (p) => $isTableCellNode(p)),
		);

	const items = [
		new NodeContextMenuOption("Insert row above", {
			$onSelect: () =>
				editor.update(() => {
					const selection = $getSelection();
					if (!$isRangeSelection(selection)) return;
					$insertTableRowAtSelection(false);
				}),
			icon: <Rows className="h-4 w-4" />,
			$showOn: (node) => isInsideCell(node),
		}),

		new NodeContextMenuOption("Insert row below", {
			$onSelect: () =>
				editor.update(() => {
					const selection = $getSelection();
					if (!$isRangeSelection(selection)) return;
					$insertTableRowAtSelection(true);
				}),
			icon: <PlusSquare className="h-4 w-4" />,
			$showOn: (node) => isInsideCell(node),
		}),

		new NodeContextMenuSeparator(),

		new NodeContextMenuOption("Insert column left", {
			$onSelect: () =>
				editor.update(() => $insertTableColumnAtSelection(false)),
			icon: <Columns className="h-4 w-4" />,
			$showOn: (node) => isInsideCell(node),
		}),

		new NodeContextMenuOption("Insert column right", {
			$onSelect: () => editor.update(() => $insertTableColumnAtSelection(true)),
			icon: <SquareDashed className="h-4 w-4" />,
			$showOn: (node) => isInsideCell(node),
		}),

		new NodeContextMenuSeparator(),

		new NodeContextMenuOption("Delete row", {
			$onSelect: () => editor.update(() => $deleteTableRowAtSelection()),
			icon: <MinusSquare className="h-4 w-4" />,
			$showOn: (node) => isInsideCell(node),
		}),

		new NodeContextMenuOption("Delete column", {
			$onSelect: () => editor.update(() => $deleteTableColumnAtSelection()),
			icon: <MinusSquare className="h-4 w-4" />,
			$showOn: (node) => isInsideCell(node),
		}),
	];

	return (
		<NodeContextMenuPlugin
			className="bg-white text-popover-foreground z-50 overflow-hidden rounded-md border shadow-md"
			itemClassName="flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-gray-200"
			separatorClassName="bg-border -mx-1 h-px"
			items={items}
		/>
	);
}
