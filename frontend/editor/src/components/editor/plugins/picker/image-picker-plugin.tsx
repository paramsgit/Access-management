import { ImageIcon } from "lucide-react";

import { InsertImageDialog } from "../../../editor/plugins/images-plugin";
import { ComponentPickerOption } from "../../../editor/plugins/picker/component-picker-option";

type ImagePickerProps = {
	convertFilesToImageUrl: (files: any) => Promise<any>;
};

export function ImagePickerPlugin(props: ImagePickerProps) {
	return new ComponentPickerOption("Image", {
		icon: <ImageIcon className="size-4" />,
		keywords: ["image", "photo", "picture", "file"],
		onSelect: (_, editor, showModal) =>
			showModal("Insert Image", (onClose) => (
				<InsertImageDialog
					activeEditor={editor}
					onClose={onClose}
					convertFilesToImageUrl={props.convertFilesToImageUrl}
				/>
			)),
	});
}
