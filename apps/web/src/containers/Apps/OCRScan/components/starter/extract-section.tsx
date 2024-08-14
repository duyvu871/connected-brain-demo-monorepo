import React from 'react';
import { useAtom } from 'jotai/index';
import { starterModalOpen } from '@/containers/Apps/OCRScan/states/starter.ts';
import ExtractResultContent from '@/containers/Apps/OCRScan/components/starter/extract-result-content.tsx';

function ExtractSection() {
	const [open, setOpen] = useAtom(starterModalOpen);

	return (
		<>
			{open ? <ExtractResultContent /> : null}
		</>
	);
}

export default ExtractSection;