import React, { useCallback, useMemo, useState } from "react";
import Modal from "./Modal";

export default function useModal(): [
	React.ReactElement | null,
	(title: string, showModal: (onClose: () => void) => React.ReactElement,uiContainer?:HTMLElement|null) => void,
	
] {
	const [modalContent, setModalContent] = useState<null | {
		closeOnClickOutside: boolean;
		content: React.ReactElement;
		title: string;
		uiContainer?:HTMLElement|null
	}>(null);

	const onClose = useCallback(() => {
		setModalContent(null);
	}, []);

	const modal = useMemo(() => {
		if (modalContent === null) {
			return null;
		}
		const { title, content, closeOnClickOutside,uiContainer } = modalContent;
		return (
			<Modal
				onClose={onClose}
				title={title}
				closeOnClickOutside={closeOnClickOutside}
				uiContainer={uiContainer}
			>
				{content}
			</Modal>
		);
	}, [modalContent, onClose]);

	const showModal = useCallback(
		(
			title: string,
			// eslint-disable-next-line no-shadow
			getContent: (onClose: () => void) => React.ReactElement,
			uiContainer?: HTMLElement | null,
			closeOnClickOutside = false,
		) => {
			setModalContent({
				closeOnClickOutside,
				content: getContent(onClose),
				title,
				uiContainer,
			});
		},
		[onClose],
	);

	return [modal, showModal];
}
