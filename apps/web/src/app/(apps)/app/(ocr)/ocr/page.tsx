import React from 'react';
import NextuiProvider from '@/providers/nextui-provider';
import DefaultPageProvider from '@/providers/page-provider/default';
import type { ToastContainerProps } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import { Toaster } from '@/global/contants/defaultComponentProps';
import StarterScreen from '@/containers/Apps/OCRScan/starter-screen';
import { UploadProvider } from '@/providers/ocr-scan/upload-provider.tsx';
import { ProcessProvider } from '@/providers/ocr-scan/process-provider.tsx';

function Page() {
	return (
		<>
			<NextuiProvider>
				<DefaultPageProvider>
					<UploadProvider>
						<ProcessProvider>
							<StarterScreen />
						</ProcessProvider>
					</UploadProvider>
				</DefaultPageProvider>
			</NextuiProvider>
			<ToastContainer {...(Toaster as ToastContainerProps)} />
		</>
	);
}

export default Page;