import React, { useEffect, useRef, useState } from "react";
import {
	$createParagraphNode,
	$insertNodes,
	$isRootOrShadowRoot,
	COMMAND_PRIORITY_EDITOR,
	createCommand,
} from "lexical";
import type { LexicalCommand, LexicalEditor } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $wrapNodeInElement, mergeRegister } from "@lexical/utils";

import { $createImageNode, ImageNode } from "./ImageNode";
import type { ImagePayload } from "./ImageNode";
export type InsertImagePayload = Readonly<ImagePayload>;

export const INSERT_IMAGE_COMMAND: LexicalCommand<InsertImagePayload> =
	createCommand("INSERT_IMAGE_COMMAND");

export function InsertImageUriDialogBody({
	onClick,
}: {
	onClick: (payload: InsertImagePayload) => void;
}) {
	const [src, setSrc] = useState<string>("");
	const [altText, setAltText] = useState<string>("");

	const isDisabled = src === "";

	return (
		<>
			<div className="Input__wrapper">
				<label className="Input__label">Image URL</label>
				<input
					type="text"
					className="Input__input"
					placeholder="i.e. https://source.unsplash.com/random"
					value={src}
					onChange={(e) => {
						setSrc(e.target.value);
					}}
					data-test-id="image-modal-url-input"
				/>
			</div>

			<div className="Input__wrapper">
				<label className="Input__label">Alt Text</label>
				<input
					type="text"
					className="Input__input"
					placeholder="Random unsplash image"
					value={altText}
					onChange={(e) => {
						setAltText(e.target.value);
					}}
					data-test-id="image-modal-alt-text-input"
				/>
			</div>

			<div className="Modal__buttonWrapper">
				<button
					disabled={isDisabled}
					className="button"
					onClick={() => {
						onClick({ altText, src });
					}}
					aria-label="Confirm"
				>
					Confirm
				</button>
			</div>
		</>
	);
}

export function InsertImageUploadedDialogBody({
	onClick,
	convertFilesToImageUrl,
}: {
	onClick: (payload: InsertImagePayload) => void;
	convertFilesToImageUrl: (
		files: FileList | null,
	) => Promise<Array<string> | null> | Array<string> | null;
}) {
	const [altText, setAltText] = useState<string>("");
	const [files, setFiles] = useState<FileList | null>(null);
	const isDisabled = files === null;

	const loadImage = (files: FileList | null) => {
		if (files && files.length > 0) {
			setFiles(files);
		} else {
			throw new Error("Could not find image");
		}
	};

	const handleClick = async () => {
		const convertedImageUrls = await convertFilesToImageUrl(files);
		if (convertedImageUrls !== null) {
			convertedImageUrls.map((src) => {
				onClick({ altText, src });
			});
		} else {
			throw new Error("Image Urls not found");
		}
	};

	return (
		<>
			<div className="Input__wrapper">
				<label className="Input__label">Image Upload</label>
				<input
					type="file"
					multiple={true}
					accept="image/*"
					className="cursor-pointer Input__input"
					onChange={(e) => loadImage(e.target.files)}
					data-test-id="image-modal-file-upload"
				/>
			</div>
			<div className="Input__wrapper">
				<label className="Input__label">Alt Text</label>
				<input
					type="text"
					className="Input__input"
					placeholder=""
					onChange={(e) => {
						setAltText(e.target.value);
					}}
					value={altText}
					data-test-id="image-modal-alt-text-input"
				/>
			</div>

			<div className="Modal__buttonWrapper">
				<button
					className="button"
					data-test-id="image-modal-file-upload-btn"
					disabled={isDisabled}
					onClick={async () => await handleClick()}
				>
					Confirm
				</button>
			</div>
		</>
	);
}

export function InsertImageDialog({
	activeEditor,
	onClose,
	convertFilesToImageUrl,
}: {
	activeEditor: LexicalEditor;
	onClose: () => void;
	convertFilesToImageUrl: (
		files: FileList | null,
	) => Promise<Array<string> | null> | Array<string> | null;
}): React.ReactElement {
	const [mode, setMode] = useState<null | "url" | "file">(null);
	const hasModifier = useRef(false);

	useEffect(() => {
		hasModifier.current = false;
		const handler = (e: KeyboardEvent) => {
			hasModifier.current = e.altKey;
		};
		document.addEventListener("keydown", handler);
		return () => {
			document.removeEventListener("keydown", handler);
		};
	}, [activeEditor]);

	const onClick = (payload: InsertImagePayload) => {
		activeEditor.dispatchCommand(INSERT_IMAGE_COMMAND, payload);
		onClose();
	};

	return (
		<>
			{!mode && (
				<div className="Modal__container">
					<button
						className="Modal__options"
						data-test-id="image-modal-option-url"
						onClick={() => setMode("url")}
					>
						Enter URL
					</button>
					<p>OR</p>
					<button
						className="Modal__options"
						data-test-id="image-modal-option-file"
						onClick={() => setMode("file")}
					>
						Select File
					</button>
				</div>
			)}
			{mode === "url" && <InsertImageUriDialogBody onClick={onClick} />}
			{mode === "file" && (
				<InsertImageUploadedDialogBody
					onClick={onClick}
					convertFilesToImageUrl={convertFilesToImageUrl}
				/>
			)}
		</>
	);
}

export default function ImagesPlugin({
	captionsEnabled,
}: {
	captionsEnabled?: boolean;
}): React.ReactElement | null {
	const [editor] = useLexicalComposerContext();

	useEffect(() => {
		if (!editor.hasNodes([ImageNode])) {
			throw new Error("ImagesPlugin: ImageNode not registered on editor");
		}

		return mergeRegister(
			editor.registerCommand<InsertImagePayload>(
				INSERT_IMAGE_COMMAND,
				(payload) => {
					const imageNode = $createImageNode(payload);
					$insertNodes([imageNode]);
					if ($isRootOrShadowRoot(imageNode.getParentOrThrow())) {
						$wrapNodeInElement(imageNode, $createParagraphNode).selectEnd();
					}
					return true;
				},
				COMMAND_PRIORITY_EDITOR,
			),
		);
	}, [captionsEnabled, editor]);

	return null;
}
