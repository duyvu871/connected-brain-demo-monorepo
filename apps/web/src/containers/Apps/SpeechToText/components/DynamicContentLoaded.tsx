'use client';
import { Center, Loader } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { sectionId } from '@/containers/Apps/SpeechToText/states/jotai';
import { usePathname, useRouter } from 'next/navigation';

interface DynamicContentLoadedProps {
	children?: React.ReactNode;
};

function DynamicContentLoaded({ children }: DynamicContentLoadedProps) {
	const router = useRouter();
	const [ready, setReady] = useState<boolean>(false);
	const [currentSection, setCurrentSection] = useAtom(sectionId);
	const pathname = usePathname();
	// check if section
	useEffect(() => {
		const url = new URL(window.location.href);
		const section = url.searchParams.get('section');
		setCurrentSection(section);
		setReady(true);
	}, [pathname]);

	if (!ready)
		return (
			<Center h={'100%'} w={'100%'}>
				<Loader color="green" size="lg" />
			</Center>
		);

	return (
		<>{children}</>
	);
}

export default DynamicContentLoaded;