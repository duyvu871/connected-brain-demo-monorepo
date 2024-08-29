'use client';
import React, { useEffect } from 'react';
import { documentId } from '@/containers/Apps/OCRScan/states/playground';
import { useAtom } from 'jotai/index';
import HeaderWrapper from '@/containers/Apps/OCRScan/header-wrapper';
import { Box } from '@mantine/core';
import MainApp from '@/containers/Apps/OCRScan/components/main-app';

function Playground({ id }: { id?: string }): React.ReactElement {
	const [, setDocId] = useAtom(documentId);

	useEffect(() => {
		if (id) {
			setDocId(id);
		}
	}, [id, setDocId]);

	return (
		// <HeaderWrapper>
				<Box className="w-full min-h-[calc(100vh_-_57px)] lg:h-[calc(100vh_-_57px)] relative flex">
					<MainApp />
				</Box>
		// </HeaderWrapper>
	);
}

export default Playground;
