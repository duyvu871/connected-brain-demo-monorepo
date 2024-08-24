"use client";
import React from 'react';
import type { ToastContainerProps } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import { Toaster } from '@/global/contants/defaultComponentProps';
import Playground from '@/containers/Apps/OCRScan/playground';
import AppLayout from '@/providers/app-provider.tsx';
import { UploadProvider } from '@/providers/ocr-scan/upload-provider.tsx';
import { ProcessProvider } from '@/providers/ocr-scan/process-provider.tsx';
import MainSidebarLayout from '@/layouts/main-sidebar.tsx';
import PlaygroundHeader from '@/containers/Apps/OCRScan/playground-header.tsx';

function Page() {
	return (
		<>
			<AppLayout>
				<MainSidebarLayout customHeader={<PlaygroundHeader />}>
					<UploadProvider>
						<ProcessProvider>
							<Playground id="playground" />
						</ProcessProvider>
					</UploadProvider>
				</MainSidebarLayout>
				<ToastContainer {...(Toaster as ToastContainerProps)} />
			</AppLayout>
		</>
	);
}

export default Page;