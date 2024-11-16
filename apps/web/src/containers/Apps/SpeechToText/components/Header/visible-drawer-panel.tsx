"use client"
import { useAtom } from 'jotai';
import "./visble-drawer-panel.css"
import React from 'react';
import { visibleDrawerPanel } from '@/containers/Apps/SpeechToText/states/jotai.ts';
import { Drawer } from '@mantine/core';
import TranscriptPanel from '@/containers/Apps/SpeechToText/components/playground/transcript-panel.tsx';
import { useDisclosure } from '@mantine/hooks';
import { Button } from '@ui/shadcn-ui/ui/button.tsx';
import { BsLayoutSidebarInsetReverse } from 'react-icons/bs';

const VisibleDrawerPanel = () => {
	const [isDrawerOpen, setIsDrawerOpen] = useAtom(visibleDrawerPanel);
	const [opened, { open, close }] = useDisclosure(false);

	return (
		<div className="lg:hidden">
			<Drawer onClose={close} opened={opened} position="right">
				<TranscriptPanel className="w-screen"/>
			</Drawer>
			<Button 
				className="font-bold rounded-lg border-zinc-300 dark:border-zinc-800 transition-colors dark:hover:bg-zinc-800 hover:bg-zinc-200 dark:text-zinc-100 dark:hover:text-zinc-50 text-zinc-700 hover:text-zinc-900" 
				onClick={open} 
				size="icon" 
				variant="outline"
			>
				<BsLayoutSidebarInsetReverse className="h-[1.2rem] w-[1.2rem] dark:text-zinc-200 text-zinc-700"/>
			</Button>
		</div>
	);
};

export default VisibleDrawerPanel;