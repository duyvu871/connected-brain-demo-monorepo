import React from 'react';
import type { ToastContainerProps } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import { Toaster } from '@/global/contants/defaultComponentProps';
import Playground from '@/containers/Apps/OCRScan/playground';
import { UploadProvider } from '@/providers/ocr-scan/upload-provider.tsx';
import { ProcessProvider } from '@/providers/ocr-scan/process-provider.tsx';
import AppLayout from '@/providers/app-provider.tsx';

function Page({ params }: { params: { documentId: string } }) {
	return (
		<>
			<AppLayout>
				<UploadProvider>
					<ProcessProvider>
						<Playground id={params.documentId} />
					</ProcessProvider>
				</UploadProvider>
			<ToastContainer {...(Toaster as ToastContainerProps)} />
			</AppLayout>
		</>
	);
}

export default Page;