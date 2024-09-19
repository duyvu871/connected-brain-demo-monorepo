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
							<Button className="bg-zinc-800" variant="bordered">
								<TbTextScan2 size={24} /> New Scan
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