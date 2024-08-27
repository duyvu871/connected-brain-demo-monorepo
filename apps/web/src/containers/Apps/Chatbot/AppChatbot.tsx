'use client';
import React, { lazy, Suspense } from 'react';

import SkeletonChatHistory from '@/components/SkeletonLoad/ChatHistory';
import SkeletonChatSection from '@/components/SkeletonLoad/ChatSection';
import '@/styles/markdownParser.css';
import ChatHistory from '@/components/Chatbot/ChatHistory';
import HistoryModal from '@/components/Chatbot/Modals/HistoryModal';

const LazyChatSection = lazy(
	() => import('@/components/Chatbot/ChatSection/index'),
);

function AppChatbot() {
	return (
		<>
			<div className="w-full h-full relative">
				<div className="w-full h-[calc(100vh_-_57px)] flex">
					<Suspense
						fallback={
							<SkeletonChatHistory
								classnames={{
									wrapper: 'max-w-sm w-full h-full',
								}}
							/>
						}>
						<ChatHistory
							classnames={{
								wrapper: 'md:block hidden',
							}}
						/>
					</Suspense>
					<div className="flex-grow md:p-5 w-0">
						<div className="w-full h-full md:border border-zinc-800 md:rounded-xl">
							<Suspense fallback={<SkeletonChatSection />}>
								<LazyChatSection />
							</Suspense>
						</div>
					</div>
				</div>
			</div>
			<HistoryModal />
		</>
	);
}

export default AppChatbot;
