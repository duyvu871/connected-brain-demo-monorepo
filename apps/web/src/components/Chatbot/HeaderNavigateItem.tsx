"use client"

import HistoryModelTrigger from '@/components/Chatbot/HistoryModelTrigger.tsx';
import { ModeToggle } from '@/components/Theme/theme-toggle.tsx';
import React from 'react';

export default function HeaderNavigateItem() {
		return (
				<>
					<ModeToggle />
					<HistoryModelTrigger />
				</>
		);
}