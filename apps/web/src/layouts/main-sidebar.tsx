"use client";

import FeatureSidebar from '@/components/Sidebar/feature.tsx';
import React from 'react';
import { cn } from '@repo/utils';
import { useAtom } from 'jotai/index';
import { sidebarOpen } from '@/states/global/sidebar.ts';
import { theme as storageTheme} from '@/states/global/theme.ts';
import ContentLayout from '@/layouts/content-layout.tsx';
import { usePathname } from 'next/navigation';
import { getAppName } from '@/lib/app-route.ts';


type MainSidebarLayoutProps = {
	children: React.ReactNode;
	customHeader?: React.ReactNode;
};

export default function MainSidebarLayout({children, customHeader}: MainSidebarLayoutProps) {
	const [isOpen] = useAtom(sidebarOpen);
	const pathName = usePathname();
	return (
		<>
			<FeatureSidebar />
			<ContentLayout customHeader={customHeader} title={getAppName(pathName)}>
				<main
					className={cn(
						"min-h-[calc(100svh_-_57px)] dark:bg-zinc-950 transition-[margin-left] ease-in-out duration-300",
						!isOpen ? "lg:ml-[90px]" : "lg:ml-72",
					)}
				>
					{children}
				</main>
			</ContentLayout>
		</>
	)
}