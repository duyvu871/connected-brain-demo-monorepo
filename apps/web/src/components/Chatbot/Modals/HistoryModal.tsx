'use client';
import React from 'react';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/modal';
import ChatHistory from '@/components/Chatbot/ChatHistory';
import { useSelector } from 'react-redux';
import type { RootState } from '@/redux/reducers';
import store from '@/redux/store';
import { hideModal } from '@/redux/actions/ChatbotAtion';
import { LiaTimesSolid } from 'react-icons/lia';
import { useAtom } from 'jotai/index';
import { theme as storageTheme } from '@/states/global/theme.ts';


function HistoryModal() {
	const isModalVisible = useSelector((state: RootState) => state.modal.history_modal);

	const handleCloseModal = () => {
		store.dispatch(hideModal('history_modal') as any);
	};

	return (
		<Modal
			classNames={{
				wrapper: 'z-[300] md:hidden absolute bottom-0 right-0 md:w-[30rem] ',
				backdrop: 'z-[250] absolute top-0 left-0 bg-zinc-100/50 dark:bg-zinc-950/50 md:hidden',
				body: 'p-0',
				footer: 'p-0',
				closeButton: 'right-0 top-0 m-1 dark:text-zinc-50 text-zinc-700 text-xl hidden',
			}}
			isOpen={isModalVisible}
			onClose={() => handleCloseModal()}
			onOpenChange={() => {
			}}
			placement="auto"
		>
			<ModalContent className="sm:border sm:border-zinc-700 sm:p-2.5 bg-zinc-950">
				{onClose => (
					<>
						<ModalHeader className="flex flex-col gap-1 bg-zinc-50 dark:bg-zinc-950">
							<div className="flex justify-between items-center">
								<p className="text-zinc-700 dark:text-zinc-100 text-lg font-semibold">Chat History</p>
								<button onClick={handleCloseModal} type="button">
									<LiaTimesSolid />
								</button>
							</div>
						</ModalHeader>
						<ModalBody className="md:hidden">
							<ChatHistory classnames={{
								wrapper: '',
								container: 'rounded-none border-none',
							}} />
						</ModalBody>
						<ModalFooter />
					</>
				)}
			</ModalContent>
		</Modal>
	);
}

export default HistoryModal;