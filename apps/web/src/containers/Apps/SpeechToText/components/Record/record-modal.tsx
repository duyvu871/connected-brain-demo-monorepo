'use client'

// import { Modal, TextInput, Radio, Textarea, Drawer } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import AudioTranscription from '@/containers/Apps/SpeechToText/components/Record/audio_transcription.tsx';
import { Button } from '@ui/shadcn-ui/ui/button.tsx';
import { Mic } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@ui/shadcn-ui/ui/dialog';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { Sheet, SheetClose, SheetContent, SheetOverlay, SheetTrigger } from '@ui/shadcn-ui/ui/sheet.tsx';
import { cn } from '@repo/utils';
import { Modal, ModalContent, ModalHeader } from '@nextui-org/react';
import { useState } from 'react';
import { recordModalVisible } from '@/containers/Apps/SpeechToText/states/jotai.ts';
import { useAtom } from 'jotai';

export function RecordModal() {
	// const [opened, { open, close }] = useDisclosure(false);
	const [isModalVisible, setIsModalVisible] = useAtom(recordModalVisible)

	const handleCloseModal = () => {
		setIsModalVisible(false);
	};
	return (
		<>
			{/*<Modal*/}
			{/*	onClose={close}*/}
			{/*	opened={opened}*/}
			{/*	size="lg"*/}
			{/*	title=""*/}
			{/*>*/}
			{/*	<AudioTranscription />*/}
			{/*</Modal>*/}
			{/*<div className="cursor-pointer flex justify-center items-center" onClick={open}>*/}
			{/*	<Button*/}
			{/*		className="bg-green-500 hover:bg-green-600 text-white"*/}
			{/*	>*/}
			{/*		<Mic className="mr-2 h-4 w-4" /> Start Recording*/}
			{/*	</Button>*/}
			{/*</div>*/}
			{/*	<Sheet>*/}
			{/*		<SheetClose />*/}
			{/*		<SheetOverlay className="z-[180] bg-zinc-100/40 dark:bg-zinc-950/40"/>*/}
			{/*		<SheetTrigger asChild >*/}
			{/*			<Button*/}
			{/*				className="bg-green-500 hover:bg-green-600 text-white"*/}
			{/*			>*/}
			{/*				<Mic className="mr-2 h-4 w-4" /> Start Recording*/}
			{/*			</Button>*/}
			{/*		</SheetTrigger>*/}
			{/*		<SheetContent className={cn('sm:w-72 px-0 h-fit !w-full flex flex-col border-zinc-700 z-[200]')} side="bottom">*/}
			{/*			<AudioTranscription />*/}
			{/*		</SheetContent>*/}
			{/*	</Sheet>*/}

				<Modal
					classNames={{
						wrapper: 'z-[300] md:hidden absolute bottom-0 right-0 md:w-[30rem] ',
						backdrop: 'z-[250] absolute top-0 left-0 bg-zinc-100/50 dark:bg-zinc-950/50 md:hidden',
						body: 'p-0',
						footer: 'p-0',
						closeButton: 'right-0 top-0 m-1 dark:text-zinc-50 text-zinc-700 text-xl',
					}}
					isOpen={isModalVisible}
					onClose={() => handleCloseModal()}
					onOpenChange={() => {}}
					placement="auto"
					size="3xl"
				>
					<ModalContent className="m-0 px-2 rounded-none sm:rounded-md border-none sm:border sm:border-zinc-800 sm:p-2.5 bg-zinc-950" >
						{(onClose) => (
							<>
									<ModalHeader className="pl-2">
										Audio Transcription
									</ModalHeader>
									<AudioTranscription />
							</>
						)}
					</ModalContent>

				</Modal>
		</>
	)
}

export function RecordModalTrigger() {
	const [, setIsModalVisible] = useAtom(recordModalVisible)
	return (
		<Button
			className="bg-green-500 hover:bg-green-600 text-white"
			onClick={() => setIsModalVisible(true)}
		>
			<Mic className="mr-2 h-4 w-4" /> Start Recording
		</Button>
	)
}

