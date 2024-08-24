"use client";

import Link from "next/link";
import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { ChevronDown, Dot } from "lucide-react";

import { cn } from "@repo/utils";
import { Button } from "@ui/shadcn-ui/ui/button";
import { DropdownMenuArrow } from "@radix-ui/react-dropdown-menu";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger
} from "@ui/shadcn-ui/ui/collapsible";
import {
	Tooltip,
	TooltipTrigger,
	TooltipContent,
	TooltipProvider
} from "@ui/shadcn-ui/ui/tooltip";
import {
	DropdownMenu,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuSeparator
} from "@ui/shadcn-ui/ui/dropdown-menu";
import useUID from '@/hooks/useUID';
import type { IconType } from 'react-icons';

type Submenu = {
	href: string;
	label: string;
	active: boolean;
};

interface CollapseMenuButtonProps {
	icon: LucideIcon | IconType;
	label: string;
	active: boolean;
	submenus: Submenu[];
	isOpen: boolean | undefined;
}

export function CollapseMenuButton({
																		 icon: Icon,
																		 label,
																		 active,
																		 submenus,
																		 isOpen
																	 }: CollapseMenuButtonProps) {
	const isSubmenuActive = submenus.some((submenu) => submenu.active);
	const [isCollapsed, setIsCollapsed] = useState<boolean>(isSubmenuActive);
	const [genID] = useUID();
	return isOpen ? (
		<Collapsible
			className="w-full"
			onOpenChange={setIsCollapsed}
			open={isCollapsed}
		>
			<CollapsibleTrigger
				asChild
				className="[&[data-state=open]>div>div>svg]:rotate-180 mb-1"
			>
				<Button
					className={cn(
						'w-full justify-start h-10 mb-1 hover:bg-zinc-800',
						{
							"bg-zinc-800": active,
						}
					)}
					variant="ghost"
				>
					<div className="w-full items-center flex justify-between">
						<div className="flex items-center">
              <span className="mr-4">
                <Icon size={18} />
              </span>
							<p
								className={cn(
									"max-w-[150px] truncate",
									isOpen
										? "translate-x-0 opacity-100"
										: "-translate-x-96 opacity-0"
								)}
							>
								{label}
							</p>
						</div>
						<div
							className={cn(
								"whitespace-nowrap",
								isOpen
									? "translate-x-0 opacity-100"
									: "-translate-x-96 opacity-0"
							)}
						>
							<ChevronDown
								className="transition-transform duration-200"
								size={18}
							/>
						</div>
					</div>
				</Button>
			</CollapsibleTrigger>
			<CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down bg-zinc-950 bg-opacity-70 backdrop-blur">
				{submenus.map(({ href, label, active }, index) => (
					<Button
						asChild
						className={cn(
							'w-full justify-start h-10 mb-1 hover:bg-zinc-800',
							{
								"bg-zinc-800": active,
							}
						)}
						key={"submenu-item-inner-button" + genID()}
						variant="ghost"
					>
						<Link href={href}>
              <span className="mr-4 ml-2">
                <Dot size={18} />
              </span>
							<p
								className={cn(
									"max-w-[170px] truncate",
									isOpen
										? "translate-x-0 opacity-100"
										: "-translate-x-96 opacity-0"
								)}
							>
								{label}
							</p>
						</Link>
					</Button>
				))}
			</CollapsibleContent>
		</Collapsible>
	) : (
		<DropdownMenu>
			<TooltipProvider disableHoverableContent>
				<Tooltip delayDuration={100}>
					<TooltipTrigger asChild>
						<DropdownMenuTrigger asChild>
							<Button
								className={cn(
									'w-full justify-start h-10 mb-1 hover:bg-zinc-800',
									{
										"bg-zinc-800": active,
									}
								)}
								variant="ghost"
							>
								<div className="w-full items-center flex justify-between">
									<div className="flex items-center">
                    <span className={cn(isOpen === false ? "" : "mr-4")}>
                      <Icon size={18} />
                    </span>
										<p
											className={cn(
												"max-w-[200px] truncate",
												isOpen === false ? "opacity-0" : "opacity-100"
											)}
										>
											{label}
										</p>
									</div>
								</div>
							</Button>
						</DropdownMenuTrigger>
					</TooltipTrigger>
					<TooltipContent align="start" alignOffset={2} className="bg-zinc-900 bg-opacity-70 backdrop-blur" side="right">
						{label}
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
			<DropdownMenuContent align="start" className="bg-zinc-900 border-zinc-700" side="right" sideOffset={25}>
				<DropdownMenuLabel className="max-w-[190px] truncate font-bold">
					{label}
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{submenus.map(({ href, label }, index) => (
					<DropdownMenuItem asChild key={'submenu-item-inner' + genID()}>
						<Link className="cursor-pointer hover:bg-zinc-800 transition-colors" href={href}>
							<p className="max-w-[180px] truncate">{label}</p>
						</Link>
					</DropdownMenuItem>
				))}
				<DropdownMenuArrow className="fill-border" />
			</DropdownMenuContent>
		</DropdownMenu>
	);
}