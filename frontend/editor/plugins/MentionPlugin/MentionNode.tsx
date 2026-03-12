import {
	type DOMConversionMap,
	type DOMConversionOutput,
	type DOMExportOutput,
	type EditorConfig,
	type LexicalNode,
	type NodeKey,
	type SerializedTextNode,
	type Spread,
	$applyNodeReplacement,
	TextNode,
} from "lexical";

export type SerializedMentionNode = Spread<
	{
		mentionName: string;
		label: string;
	},
	SerializedTextNode
>;

function convertMentionElement(
	domNode: HTMLElement,
): DOMConversionOutput | null {
	const textContent = domNode.textContent;
	const mentionName = domNode.getAttribute("data-lexical-user");

	if (textContent !== null && mentionName !== null) {
		const node = $createMentionNode(mentionName, textContent);
		return {
			node,
		};
	}

	return null;
}

const mentionStyle = "background-color: rgba(24, 119, 232, 0.2)";
export class MentionNode extends TextNode {
	__mention: string;
	__label: string;

	static getType(): string {
		return "mention";
	}

	static clone(node: MentionNode): MentionNode {
		return new MentionNode(
			node.__mention,
			node.__label,
			node.__text,
			node.__key,
		);
	}
	static importJSON(serializedNode: SerializedMentionNode): MentionNode {
		const node = $createMentionNode(
			serializedNode.mentionName,
			serializedNode.label,
		);
		node.setTextContent(serializedNode.text);
		node.setFormat(serializedNode.format);
		node.setDetail(serializedNode.detail);
		node.setMode(serializedNode.mode);
		node.setStyle(serializedNode.style);
		return node;
	}

	constructor(
		mentionName: string,
		label: string,
		text?: string,
		key?: NodeKey,
	) {
		super(text ?? label, key);
		this.__mention = mentionName;
		this.__label = label;
	}

	exportJSON(): SerializedMentionNode {
		return {
			...super.exportJSON(),
			mentionName: this.__mention,
			label: this.__label,
			type: "mention",
			version: 1,
		};
	}

	createDOM(config: EditorConfig): HTMLElement {
		const dom = super.createDOM(config);
		dom.style.cssText = mentionStyle;
		dom.className = "mention";
		return dom;
	}

	exportDOM(): DOMExportOutput {
		const element = document.createElement("span");
		element.setAttribute("data-lexical-mention", "true");
		element.setAttribute("data-lexical-user", this.__mention);
		element.setAttribute("class", "html_mention");
		element.textContent = this.__label;
		return { element };
	}

	static importDOM(): DOMConversionMap | null {
		return {
			span: (domNode: HTMLElement) => {
				if (
					!domNode.hasAttribute("data-lexical-mention") ||
					!domNode.hasAttribute("data-lexical-user")
				) {
					return null;
				}
				return {
					conversion: convertMentionElement,
					priority: 1,
				};
			},
		};
	}

	isTextEntity(): true {
		return true;
	}

	canInsertTextBefore(): boolean {
		return false;
	}

	canInsertTextAfter(): boolean {
		return false;
	}
}

export function $createMentionNode(
	mentionName: string,
	label: string,
): MentionNode {
	const mentionNode = new MentionNode(mentionName, label);
	mentionNode.setMode("segmented").toggleDirectionless();
	return $applyNodeReplacement(mentionNode);
}

export function $isMentionNode(
	node: LexicalNode | null | undefined,
): node is MentionNode {
	return node instanceof MentionNode;
}
