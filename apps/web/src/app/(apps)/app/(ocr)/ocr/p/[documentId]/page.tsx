import React from 'react';
import NextuiProvider from '@/providers/nextui-provider';
import DefaultPageProvider from '@/providers/page-provider/default';
import type { ToastContainerProps } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import { Toaster } from '@/global/contants/defaultComponentProps';
import Playground from '@/containers/Apps/OCRScan/playground';

function Page({ params }: { params: { documentId: string } }) {
	return (
		<>
			<NextuiProvider>
				<DefaultPageProvider>
					<Playground id={params.documentId} />
				</DefaultPageProvider>
			</NextuiProvider>
			<ToastContainer {...(Toaster as ToastContainerProps)} />
		</>
	);
}

export default Page;