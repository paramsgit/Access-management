import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getNearestNodeFromDOMNode, type LexicalEditor } from "lexical";
import { TableCellNode } from "@lexical/table";
import { useEffect } from "react";

export default function TableResizePlugin() {
	const [editor] = useLexicalComposerContext();

	useEffect(() => {
		const root = editor.getRootElement();
		if (!root) return;

		const observer = new MutationObserver(() => {
			attachResizeHandles(root, editor);
		});

		observer.observe(root, { subtree: true, childList: true });
		attachResizeHandles(root, editor);

		return () => observer.disconnect();
	}, [editor]);

	return null;
}

function attachResizeHandles(root: HTMLElement, editor: LexicalEditor) {
	const tables = root.querySelectorAll("table");

	tables.forEach((table) => {
		const firstRow = table.rows[0];
		if (!firstRow) return;

		Array.from(firstRow.cells).forEach((cell, colIdx) => {
			if (cell.querySelector(".col-resizer")) return;

			const handle = document.createElement("div");
			handle.className = "col-resizer";

			Object.assign(handle.style, {
				position: "absolute",
				right: "0",
				top: "0",
				width: "6px",
				cursor: "col-resize",
				height: "100%",
				zIndex: 5,
			});

			cell.style.position = "relative";
			cell.appendChild(handle);

			handle.addEventListener("mousedown", (e) =>
				startColumnResize(e, table, colIdx, editor),
			);
		});
	});
}

function startColumnResize(
	e: MouseEvent,
	table: HTMLTableElement,
	columnIndex: number,
	editor: LexicalEditor,
) {
	const startX = e.clientX;
	const cell = table.rows[0].cells[columnIndex];
	const initialWidth = cell.offsetWidth;

	function onMove(ev: MouseEvent) {
		const delta = ev.clientX - startX;
		const newWidth = Math.max(initialWidth + delta, 40);

		editor.update(() => {
			applyWidth(editor, table, columnIndex, newWidth);
		});

		// Live UI update
		cell.style.width = `${newWidth}px`;
	}

	function onStop() {
		document.removeEventListener("mousemove", onMove);
		document.removeEventListener("mouseup", onStop);
	}

	document.addEventListener("mousemove", onMove);
	document.addEventListener("mouseup", onStop);
}

function applyWidth(
	_: LexicalEditor,
	tableElem: HTMLTableElement,
	columnIndex: number,
	width: number,
) {
	const rows = Array.from(tableElem.rows);

	rows.forEach((row) => {
		const cellDom = row.cells[columnIndex];
		if (!cellDom) return;

		const cellNode = $getNearestNodeFromDOMNode(cellDom);
		if (!(cellNode instanceof TableCellNode)) return;

		cellNode.setWidth(width); // BUILT-IN Lexical API 🎉
	});
}
