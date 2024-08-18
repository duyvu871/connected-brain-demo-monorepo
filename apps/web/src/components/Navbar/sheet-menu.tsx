import Link from "next/link";
import { MenuIcon, PanelsTopLeft } from "lucide-react";

import { Button } from "@ui/shadcn-ui/ui/button";
import { Menu } from "@/components/Sidebar/menu";
import {
	Sheet,
	SheetHeader,
	SheetContent,
	SheetTrigger,
} from "@ui/shadcn-ui/ui/sheet";
import { cn } from '@repo/utils';
import { Logo } from '@ui/Icons';
import React from 'react';
import { useAtom } from 'jotai/index';
import { sidebarOpen } from '@/states/global/sidebar.ts';
import { theme as storageTheme } from '@/states/global/theme.ts';

export function SheetMenu() {
	const [isOpen] = useAtom(sidebarOpen);
	const [theme] = useAtom(storageTheme);
	return (
		<Sheet>
			<SheetTrigger asChild className="lg:hidden">
				<Button className="h-8 border-zinc-700" size="icon" variant="outline">
					<MenuIcon size={20} />
				</Button>
			</SheetTrigger>
			<SheetContent className={cn('sm:w-72 px-3 h-full flex flex-col border-zinc-700 z-[200]', theme)} side="left">
				<div
					className={cn(
						"flex justify-center transition-transform ease-in-out duration-300 mb-1",
						!isOpen ? "translate-x-1" : "translate-x-0"
					)}
				>
					<Link className="flex items-center gap-2" href="/">
						<Logo className="w-8 h-8 mr-1 fill-zinc-200" />
						<h1
							className={cn(
								"font-bold text-lg whitespace-nowrap transition-[transform,opacity,display] ease-in-out duration-300",
								!isOpen
									? "-translate-x-96 opacity-0 hidden"
									: "translate-x-0 opacity-100"
							)}
						>
							Connected Brain
						</h1>
					</Link>
				</div>
				<Menu isOpen />
			</SheetContent>
		</Sheet>
	);
}