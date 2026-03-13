"use client";

import type { JSX } from "react";
import type { SerializedEditorState } from "lexical";

import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { CLEAR_HISTORY_COMMAND } from "lexical";
import { SendIcon } from "lucide-react";
import { toast } from "sonner";

import {
	docFromHash,
	docToHash,
} from "../../../editor/utils/doc-serialization";
import { Button } from "../../../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../../ui/tooltip";

export function ShareContentPlugin(): JSX.Element {
	const [editor] = useLexicalComposerContext();

	async function shareDoc(doc: SerializedEditorState): Promise<void> {
		const url = new URL(window.location.toString());
		url.hash = await docToHash(doc);
		const newUrl = url.toString();
		window.history.replaceState({}, "", newUrl);
		await window.navigator.clipboard.writeText(newUrl);
	}

	useEffect(() => {
		docFromHash(window.location.hash).then((doc) => {
			if (doc) {
				const newState = editor.parseEditorState(doc);
				editor.setEditorState(newState);
				editor.dispatchCommand(CLEAR_HISTORY_COMMAND, undefined);
			}
		});
	}, [editor]);

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button
					variant="ghost"
					onClick={() =>
						shareDoc(editor.getEditorState().toJSON()).then(
							() => toast.success("URL copied to clipboard"),
							() => toast.error("URL could not be copied to clipboard"),
						)
					}
					title="Share"
					aria-label="Share editor content"
					size="sm"
					className="p-2"
				>
					<SendIcon className="size-4" />
				</Button>
			</TooltipTrigger>
			<TooltipContent>Share Content</TooltipContent>
		</Tooltip>
	);
}
