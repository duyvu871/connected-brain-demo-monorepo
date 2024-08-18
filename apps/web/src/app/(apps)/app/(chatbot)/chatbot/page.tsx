import React from 'react';
import AppLayout from '@/providers/app-provider.tsx';
import AppChatbot from '@/containers/Apps/Chatbot/AppChatbot';
import { ChatbotProvider } from '@/providers/ChatbotContext';
import { getServerAuthSession } from '@/lib/nextauthOptions';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import MainSidebarLayout from '@/layouts/main-sidebar.tsx';
import HeaderNavigateItem from '@/components/Chatbot/HeaderNavigateItem.tsx';

async function Page() {
	const session = await getServerAuthSession();
	const header = headers();
	const pathname = header.get('x-pathname');
	if (!session?.user) {
		return redirect('/auth/method?type=login');
	}
	return (
					<AppLayout>
						<ChatbotProvider>
							<MainSidebarLayout customHeader={<HeaderNavigateItem />}>
								<AppChatbot />
							</MainSidebarLayout>
						</ChatbotProvider>
					</AppLayout>
	);
}

export default Page;
