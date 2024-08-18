import { NavbarFeature } from '@/components/Navbar/feature.tsx';
import React from 'react';
import HistoryModelTrigger from '@/components/Chatbot/HistoryModelTrigger.tsx';

type ContentLayoutProps = {
	children: React.ReactNode;
	customHeader?: React.ReactNode;
	title?: string;
}

export default function ContentLayout({children, title, customHeader}: ContentLayoutProps) {
	return (
		<>
			<NavbarFeature title={title ?? "Explore"}>
				{customHeader}
			</NavbarFeature>
			{children}
		</>
	)
}