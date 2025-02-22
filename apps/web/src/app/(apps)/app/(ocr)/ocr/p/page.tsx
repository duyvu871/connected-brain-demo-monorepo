
import React from 'react';
import { redirect } from 'next/navigation';
import type { ToastContainerProps } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import { Toaster } from '@/global/contants/defaultComponentProps';
import Playground from '@/containers/Apps/OCRScan/playground';
import AppLayout from '@/providers/app-provider.tsx';
import { UploadProvider } from '@/providers/ocr-scan/upload-provider.tsx';
import { ProcessProvider } from '@/providers/ocr-scan/process-provider.tsx';
import MainSidebarLayout from '@/layouts/main-sidebar.tsx';
import PlaygroundHeader from '@/containers/Apps/OCRScan/playground-header.tsx';
import { getServerAuthSession } from '@/lib/nextauthOptions.ts';
import { headers } from 'next/headers';
// import UploadScreen from '@/containers/Apps/OCRScan/components/playground/upload-screen.tsx';
// import PlaygroundFeature from '@/containers/Apps/OCRScan/components/playground-feature.tsx';

async function Page() {
	const session = await getServerAuthSession();
	const header = headers();
	const pathname = header.get('x-pathname');
	if (!session?.user) {
		return redirect('/auth/method?type=login');
	}
	return (
		<>
			<AppLayout>
				<MainSidebarLayout customHeader={<PlaygroundHeader />}>
					<UploadProvider>
						<ProcessProvider>
							<Playground />
						</ProcessProvider>
					</UploadProvider>
				</MainSidebarLayout>
				<ToastContainer {...(Toaster as ToastContainerProps)} />
			</AppLayout>
		</>
	);
}

export default Page;