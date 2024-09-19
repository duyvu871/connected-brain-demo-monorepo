import MainSidebarLayout from '@/layouts/main-sidebar';
import React from 'react';
import AppProvider from '@/providers/app-provider.tsx';
import { ModeToggle } from '@/components/Theme/theme-toggle.tsx';

type ExploreLayoutProps = {
	children: React.ReactNode;
};

export default function ExploreLayout({children}: ExploreLayoutProps) {
	return (
		<AppProvider>
			<MainSidebarLayout customHeader={
				<>
					<ModeToggle />
				</>
			}>
					{children}
			</MainSidebarLayout>
		</AppProvider>
	)
}