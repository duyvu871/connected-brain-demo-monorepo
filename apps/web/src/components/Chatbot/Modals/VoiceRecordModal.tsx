import React from 'react';
import ModalWrapper from '@/components/Chatbot/Modals/ModalWrapper';
import VoiceRecord from '@/components/PopoverComponent/VoiceRecord';

interface VoiceRecordModalProps {
	children: React.ReactNode;
};

function VoiceRecordModal({ children }: VoiceRecordModalProps) {
	return (
		<ModalWrapper content={<VoiceRecord />} trigger={children} />
	);
}

export default VoiceRecordModal;