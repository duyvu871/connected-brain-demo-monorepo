import MainSidebarLayout from '@/layouts/main-sidebar';
import React from 'react';
import DefaultPageProvider from '@/providers/page-provider/default.tsx';
import AppProvider from '@/providers/app-provider.tsx';

type ExploreLayoutProps = {
	children: React.ReactNode;
};

export default function ExploreLayout({children}: ExploreLayoutProps) {
	return (
		<AppProvider>
			<DefaultPageProvider>
				<MainSidebarLayout>
					{children}
				</MainSidebarLayout>
			</DefaultPageProvider>
		</AppProvider>
	)
}