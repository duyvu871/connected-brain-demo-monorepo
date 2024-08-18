import { Box } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Logo from '@ui/Icons/logo';
import { TbTextScan2 } from "react-icons/tb";
import { usePathname } from 'next/navigation';
import DialogFeedback from '@/containers/Apps/OCRScan/components/dialog/dialog-feedback';
import DropdownMenuUser from '@/containers/Apps/OCRScan/components/dropdown/dropdown-menu';
import { Button } from '@nextui-org/react';

export default function Header(): React.ReactNode {
	const pathname = usePathname();
	// const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
	const [isStarterScreen, setIsStarterScreen] = useState(false);

	useEffect(() => {
		if (pathname === '/app/ocr') {
			setIsStarterScreen(true);
		} else {
			setIsStarterScreen(false);
		}
	}, [pathname]);

	return (
		<header
			className="flex w-full flex-col gap-3 p-3 md:h-16 md:flex-row md:items-center lg:px-4 bg-black/95 backdrop-blur bg-opacity-0 supports-[backdrop-filter]:bg-black/60">
			<Box className="flex w-full items-center gap-8">
				<Box className="flex items-center gap-2">
					<Link className="rounded focus:outline-0 focus:ring-0 focus-visible:bg-zinc-200" href="/" passHref>
						<Logo className="fill-zinc-200 w-8" />
					</Link>
					{
						!isStarterScreen && (
							<Box className="text-white text-lg font-bold">
								OCR
							</Box>
						)
					}
				</Box>
				<Box className="ml-auto flex items-center gap-2 sm:gap-4">
					{
						!isStarterScreen && (
							<Link href="/app/ocr" passHref>
								<Box className="text-white text-lg font-bold">
									<Button className="bg-zinc-800" variant="bordered">
										<TbTextScan2 size={24}/> New Scan
									</Button>
								</Box>
							</Link>
						)
					}
					<DialogFeedback />
					<DropdownMenuUser />
				</Box>
			</Box>
		</header>
	);
}