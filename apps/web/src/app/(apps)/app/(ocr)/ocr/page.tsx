import React from 'react';
import type { ToastContainerProps } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import { Toaster } from '@/global/contants/defaultComponentProps';
import StarterScreen from '@/containers/Apps/OCRScan/starter-screen';
import { UploadProvider } from '@/providers/ocr-scan/upload-provider.tsx';
import { ProcessProvider } from '@/providers/ocr-scan/process-provider.tsx';
import AppLayout from '@/providers/app-provider.tsx';

function Page() {
	return (
		<>
			<AppLayout>
					<UploadProvider>
						<ProcessProvider>
							<StarterScreen />
						</ProcessProvider>
					</UploadProvider>
				<ToastContainer {...(Toaster as ToastContainerProps)} />
			</AppLayout>
		</>
	);
}

export default Page;