'use client';
import React from 'react';
import { MantineProviderClient } from '@/providers/mantine-provider';
import 'react-toastify/dist/ReactToastify.css';
import { Provider as JotaiProvider } from 'jotai';

interface ProvidersLayoutProps {
	children: React.ReactNode;
};

function DefaultPageProvider({ children }: ProvidersLayoutProps) {
	return (
		<>
			<JotaiProvider>
					<MantineProviderClient>
						{children}
					</MantineProviderClient>
			</JotaiProvider>
			{/*<Script src={'/scripts/donut-shaped.js'} defer={true} />*/}
		</>
	);
}

export default DefaultPageProvider;