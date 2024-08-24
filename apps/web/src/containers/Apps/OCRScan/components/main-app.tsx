import { Box } from '@mantine/core';
import Toolbar from '@/containers/Apps/OCRScan/components/playground/toolbar.tsx';

import React from 'react';
import ExtractResult from '@/containers/Apps/OCRScan/components/playground/extract-result.tsx';

export default function MainApp(): JSX.Element {
	return (
		<Box className="h-full w-full flex flex-col-reverse sm:flex-row gap-5 justify-center items-start p-5">
			<div className="flex-grow max-w-[400px] w-full sm:w-fit sm:max-w-full">
				<div className="flex flex-col gap-4">
					<ExtractResult />
				</div>
			</div>
			<div className="flex-grow max-w-[400px] w-full">
				<Toolbar />
			</div>
		</Box>
	);
}