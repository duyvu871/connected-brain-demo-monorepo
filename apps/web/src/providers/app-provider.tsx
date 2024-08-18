"use client";

import React from 'react';
import NextAuthSessionProviders from '@/providers/auth/NextAuthSessionProviders.tsx';
import NextuiProvider from '@/providers/nextui-provider.tsx';
import { MantineProviderClient } from '@/providers/mantine-provider.tsx';
import { AuthProvider } from '@/providers/AuthContext.tsx';
import { Provider as JotaiProvider } from 'jotai';
import ReduxProviders from '@/providers/ReduxProviders.tsx';

type AppProviderProps = {
	children: React.ReactNode;
};

export default function AppProvider({children}: AppProviderProps) {
	return (
		<NextAuthSessionProviders>
			<AuthProvider>
				<NextuiProvider>
					<MantineProviderClient>
						<JotaiProvider>
							<ReduxProviders>
								{children}
							</ReduxProviders>
						</JotaiProvider>
					</MantineProviderClient>
				</NextuiProvider>
			</AuthProvider>
		</NextAuthSessionProviders>
	)
};