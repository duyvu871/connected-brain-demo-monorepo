// @flow
import * as React from 'react';
import HeaderNavigateItem from '@/components/Chatbot/HeaderNavigateItem.tsx';
import MainSidebarLayout from '@/layouts/main-sidebar.tsx';
import AppLayout from '@/providers/app-provider.tsx';
import Starter from '@/containers/Apps_v1/TextToSpeech/starter.tsx';

export default function Page() {
	return (
		<AppLayout>
				<MainSidebarLayout customHeader={<HeaderNavigateItem />}>
					<Starter />
				</MainSidebarLayout>
		</AppLayout>
	);
};