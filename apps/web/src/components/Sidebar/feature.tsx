import React from 'react';
import Link from 'next/link';
import { cn } from '@repo/utils';
import { Logo } from '@ui/Icons';
import { SidebarToggle } from '@/components/Sidebar/toggle';
import { useAtom } from 'jotai/index';
import { sidebarOpen } from '@/states/global/sidebar';
import { Menu } from '@/components/Sidebar/menu';

function FeatureSidebar() {
	const [isOpen, setIsOpen] = useAtom(sidebarOpen);
	return (
			<aside
				className={cn(
					"fixed top-0 left-0 z-[120] bg-zinc-50 dark:bg-zinc-950 h-screen -translate-x-full lg:translate-x-0 transition-[width] ease-in-out duration-300 border-r border-zinc-200 dark:border-zinc-900",
					!isOpen ? "w-[90px]" : "w-72"
				)}
			>
				<SidebarToggle isOpen={isOpen} setIsOpen={setIsOpen} />
				<div className="relative h-full flex flex-col px-3 py-4 overflow-y-auto shadow-md dark:shadow-zinc-800">
					<div
						className={cn(
							"flex justify-center transition-transform ease-in-out duration-300 mb-1",
							!isOpen ? "translate-x-1" : "translate-x-0"
						)}
					>
						<Link className="flex items-center gap-2" href="/">
							<Logo className="w-8 h-8 mr-1 fill-zinc-700 dark:fill-zinc-200" />
							<h1
								className={cn(
									"font-bold text-lg text-zinc-700 dark:text-zinc-100 whitespace-nowrap transition-[transform,opacity,display] ease-in-out duration-300",
									!isOpen
										? "-translate-x-96 opacity-0 hidden"
										: "translate-x-0 opacity-100"
								)}
							>
								Connected Brain
							</h1>
						</Link>
					</div>
					<Menu isOpen={isOpen} />
				</div>
			</aside>
	);
}

export default FeatureSidebar;