"use client";
import React, { useEffect } from 'react';
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from '@ui/shadcn-ui/ui/dialog';
import { starterModalOpen } from '@/containers/Apps/OCRScan/states/starter';
import { useAtom } from 'jotai';

import ExtractResultContent from '@/containers/Apps/OCRScan/components/starter/extract-result-content';

interface ExtractResultProps {
	children: React.ReactNode;
}

function ExtractResult({children}: ExtractResultProps): JSX.Element {
	const [open, setOpen] = useAtom(starterModalOpen);

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogTrigger asChild>
				{children}
			</DialogTrigger>
			<DialogTitle className="text-zinc-300 hidden">
				Extract result
			</DialogTitle>
			<DialogContent
				aria-describedby={undefined}
				className="sm:p-10 bg-zinc-950 border-zinc-700 rounded-lg w-fit max-w-[calc(100%-40px)]"
			>
				<ExtractResultContent />
			</DialogContent>
		</Dialog>
	);
}

export default ExtractResult;