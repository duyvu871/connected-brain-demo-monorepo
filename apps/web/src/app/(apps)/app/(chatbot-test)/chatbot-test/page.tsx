'use client';

import dynamic from 'next/dynamic';
import React from 'react';
const AppChatbot = dynamic(() => import('@/containers/Apps_v1/Chatbot/AppChatbot'), {
	ssr: false
});
import { ToastContainer, type ToastContainerProps } from 'react-toastify';
import { Toaster } from 'global/contants/defaultComponentProps.ts';
import NextuiProvider from '@/providers/nextui-provider';
import { MantineProviderClient } from '@/providers/mantine-provider';
import { Provider as JotaiProvider } from 'jotai';
import ReduxProviders from '@/providers/ReduxProviders.tsx';
import { cn } from '@repo/utils';
import 'react-toastify/dist/ReactToastify.css'

function Page() {
	return (
		<NextuiProvider>
			<MantineProviderClient>
				<JotaiProvider>
					<ReduxProviders>
						<main
							className={cn(
								"min-h-[100svh] bg-white dark:bg-zinc-950 transition-[margin-left] ease-in-out duration-300",
							)}
						>
							<AppChatbot />
							<ToastContainer {...(Toaster as ToastContainerProps)} />
						</main>
					</ReduxProviders>
				</JotaiProvider>
			</MantineProviderClient>
		</NextuiProvider>
);
}

export default Page;