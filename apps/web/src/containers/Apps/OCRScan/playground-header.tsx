"use client"
import Link from 'next/link';
import { Box } from '@mantine/core';
import { Button } from '@nextui-org/react';
import { TbTextScan2 } from 'react-icons/tb';
import DialogFeedback from '@/containers/Apps/OCRScan/components/dialog/dialog-feedback.tsx';
import DropdownMenuUser from '@/containers/Apps/OCRScan/components/dropdown/dropdown-menu.tsx';
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ModeToggle } from '@/components/Theme/theme-toggle.tsx';

export default function PlaygroundHeader() {
	const pathname = usePathname();
	// const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
	const [isStarterScreen, setIsStarterScreen] = useState(false);

	useEffect(() => {
		if (pathname !== '/app/ocr/p' && pathname !== '/app/ocr/') {
			setIsStarterScreen(true);
		} else {
			setIsStarterScreen(false);
		}
	}, [pathname]);

	return (
		<>
			{
				!isStarterScreen && (
					<Link href="/app/ocr/p" passHref>
						<Box className="text-white text-lg font-bold">
							<Button className="dark:bg-zinc-800 dark:text-zinc-100 bg-zinc-100 text-zinc-700 aspect-square sm:aspect-auto min-w-fit !w-fit" variant="bordered">
								<TbTextScan2 size={24} /> <span className="hidden sm:block">New Scan</span>
							</Button>
						</Box>
					</Link>
				)
			}
			<DialogFeedback />
			<ModeToggle />
		</>
	);
}