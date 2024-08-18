import React from 'react';
import ModalWrapper from '@/components/Chatbot/Modals/ModalWrapper';
import UploadPopover from '@/components/UploadPopover/UploadPopover';

interface UploadModalProps {
	children: React.ReactNode;
};

function UploadModal({ children }: UploadModalProps) {
	return (
		<ModalWrapper content={<UploadPopover />} trigger={children} />
	);
}

export default UploadModal;