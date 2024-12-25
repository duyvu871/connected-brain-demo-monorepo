import React from 'react';
import type { ToastContainerProps } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import { Toaster } from '@/global/contants/defaultComponentProps';
import AppLayout from '@/providers/app-provider.tsx';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { getServerAuthSession } from '@/lib/nextauthOptions.ts';
import MainSidebarLayout from '@/layouts/main-sidebar.tsx';
import PlaygroundHeader from '@/containers/Apps/OCRScan/playground-header.tsx';
import { VoiceSeparator } from '@/containers/Apps/VoiceSeparation/AppVoiceSeparation.tsx';
// import Playground from '@/containers/Apps/OCRScan/playground.tsx';

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
					<VoiceSeparator />
					<ToastContainer {...(Toaster as ToastContainerProps)} />
				</MainSidebarLayout>
			</AppLayout>
		</>
	);
}

export default Page;