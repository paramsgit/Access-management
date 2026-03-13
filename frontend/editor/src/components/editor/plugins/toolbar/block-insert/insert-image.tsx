import { ImageIcon } from "lucide-react";

import { useToolbarContext } from "../../../../editor/context/toolbar-context";
import { InsertImageDialog } from "../../../../editor/plugins/images-plugin";
import { SelectItem } from "../../../../ui/select";

export function InsertImage({
	convertFilesToImageUrl,
}: {
	convertFilesToImageUrl: (files: any) => Promise<any>;
}) {
	const { activeEditor, showModal } = useToolbarContext();

	return (
		<SelectItem
			value="image"
			onPointerUp={() => {
				showModal("Insert Image", (onClose) => (
					<InsertImageDialog
						convertFilesToImageUrl={convertFilesToImageUrl}
						activeEditor={activeEditor}
						onClose={onClose}
					/>
				));
			}}
			className=""
		>
			<div className="flex items-center gap-1">
				<ImageIcon className="size-4" />
				<span>Image</span>
			</div>
		</SelectItem>
	);
}
