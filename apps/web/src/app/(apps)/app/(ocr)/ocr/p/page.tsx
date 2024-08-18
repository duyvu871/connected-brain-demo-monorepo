"use client";
import React from 'react';
import type { ToastContainerProps } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import { Toaster } from '@/global/contants/defaultComponentProps';
import Playground from '@/containers/Apps/OCRScan/playground';
import AppLayout from '@/providers/app-provider.tsx';
import { UploadProvider } from '@/providers/ocr-scan/upload-provider.tsx';
import { ProcessProvider } from '@/providers/ocr-scan/process-provider.tsx';

function Page() {
	return (
		<>
			<AppLayout>
				<UploadProvider>
					<ProcessProvider>
						<Playground id="playground" />
					</ProcessProvider>
				</UploadProvider>
				<ToastContainer {...(Toaster as ToastContainerProps)} />
			</AppLayout>
		</>
	);
}

export default Page;