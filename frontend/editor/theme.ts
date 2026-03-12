import type { EditorThemeClasses } from "lexical";
import "./index.css";

export const EditorTheme: EditorThemeClasses = {
	blockCursor: "EditorTheme__blockCursor",
	heading: {
		h1: "EditorTheme__h1",
	},
	image: "editor-image",
	indent: "EditorTheme__indent",
	layoutContainer: "EditorTheme__layoutContaner",
	layoutItem: "EditorTheme__layoutItem",
	link: "EditorTheme__link",
	list: {
		listitem: "EditorTheme__listItem",
		nested: {
			listitem: "EditorTheme__nestedListItem",
		},
		ulDepth: [
			"list-inside list-disc",
			"list-inside list-[circle]",
			"list-inside list-[square]",
		],
		olDepth: [
			"EditorTheme__ol1",
			"EditorTheme__ol2",
			"EditorTheme__ol3",
			"EditorTheme__ol4",
			"EditorTheme__ol5",
		],
	},
	ltr: "EditorTheme__ltr",
	paragraph: "EditorTheme__paragraph",
	table: "EditorTheme__table",
	tableAddColumns: "EditorTheme__tableAddColumns",
	tableAddRows: "EditorTheme__tableAddRows",
	tableCell: "EditorTheme__tableCell",
	tableCellActionButton: "EditorTheme__tableCellActionButton",
	tableCellActionButtonContainer: "EditorTheme__tableCellActionButtonContainer",
	tableCellEditing: "EditorTheme__tableCellEditing",
	tableCellHeader: "EditorTheme__tableCellHeader",
	tableCellPrimarySelected: "EditorTheme__tableCellPrimarySelected",
	tableCellResizer: "EditorTheme__tableCellResizer",
	tableCellSelected: "EditorTheme__tableCellSelected",
	tableCellSortedIndicator: "EditorTheme__tableCellSortedIndicator",
	tableResizeRuler: "EditorTheme__tableCellResizeRuler",
	tableSelected: "EditorTheme__tableSelected",
	tableSelection: "EditorTheme__tableSelection",
	text: {
		bold: "EditorTheme__textBold",
		italic: "EditorTheme__textItalic",
		underline: "EditorTheme__textUnderline",
	},
};
