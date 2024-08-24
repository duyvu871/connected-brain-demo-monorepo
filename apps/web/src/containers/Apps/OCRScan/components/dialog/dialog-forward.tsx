'use client';
import React from 'react';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/modal';
import { LiaTimesSolid } from 'react-icons/lia';
import { useAtom } from 'jotai/index';
import { theme as storageTheme } from '@/states/global/theme.ts';
import { openForwardedDialog } from '@/containers/Apps/OCRScan/states/starter.ts';
import Link from 'next/link';
import { Button } from '@ui/shadcn-ui/ui/button.tsx';

function DialogForward() {
	const [theme] = useAtom(storageTheme);
	const [dialogState, setDialogState]= useAtom(openForwardedDialog);

	const handleCloseModal = () => {
		setDialogState({forwardUrl: '', forwardTitle: '', isOpened: false});
	};

	return (
		<Modal
			className={theme}
			isOpen={dialogState.isOpened}
			onClose={() => handleCloseModal()}
			onOpenChange={() => {}}
			placement="center"
		>
			<ModalContent className="sm:border sm:border-zinc-700 sm:p-2.5 bg-zinc-950">
				{onClose => (
					<>
						<ModalHeader className="flex flex-col gap-1 bg-zinc-950" />
						<ModalBody className="flex justify-center items-center w-full">
							<Link className="bg-zinc-800 hover:bg-xinc-700 max-w-72 rounded-xl p-2" href={dialogState.forwardUrl} passHref>
								{/*<Button className="bg-zinc-800 hover:bg-xinc-700 max-w-72" variant="default">*/}
									{dialogState.forwardTitle}
								{/*</Button>*/}
							</Link>
						</ModalBody>
						<ModalFooter />
					</>
				)}
			</ModalContent>
		</Modal>
	);
}

export default DialogForward;