import { Box } from '@mantine/core';
import Toolbar from '@/containers/Apps/OCRScan/components/playground/toolbar.tsx';

import React from 'react';
import ExtractResult from '@/containers/Apps/OCRScan/components/playground/extract-result.tsx';

export default function MainApp(): JSX.Element {
	return (
		<Box className="h-full w-full flex justify-center items-start pb-6">
			<div className="flex-grow">
				<div className="flex flex-col gap-4">
					<ExtractResult />
				</div>
			</div>
			<div className="flex-grow max-w-[300px]">
				<Toolbar />
			</div>
		</Box>
	);
}