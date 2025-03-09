'use client';

import React from 'react';
import AppChatbot from '@/containers/Apps_v1/Chatbot/AppChatbot';
import { ToastContainer, type ToastContainerProps } from 'react-toastify';
import { Toaster } from 'global/contants/defaultComponentProps.ts';
import NextuiProvider from '@/providers/nextui-provider';
import { MantineProviderClient } from '@/providers/mantine-provider';
import { Provider as JotaiProvider } from 'jotai';
import ReduxProviders from '@/providers/ReduxProviders.tsx';

function Page() {
	return (
		<NextuiProvider>
			<MantineProviderClient>
				<JotaiProvider>
					<ReduxProviders>
						<AppChatbot />
						<ToastContainer {...(Toaster as ToastContainerProps)} />
					</ReduxProviders>
				</JotaiProvider>
			</MantineProviderClient>
		</NextuiProvider>
	);
}

export default Page;