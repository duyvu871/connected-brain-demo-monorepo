"use client";

import Link from "next/link";
import { Ellipsis, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";

import { cn } from "@repo/utils";
import { getMenuList } from "@/lib/menuList";
import { Button } from "@ui/shadcn-ui/ui/button";
import { ScrollArea } from "@ui/shadcn-ui/ui/scroll-area";
import { CollapseMenuButton } from "@/components/Sidebar/collapse-menu-button";
import {
	Tooltip,
	TooltipTrigger,
	TooltipContent,
	TooltipProvider
} from "@ui/shadcn-ui/ui/tooltip";
import useUID from "@/hooks/useUID";
import { signOut } from 'next-auth/react';
import { useAtom } from 'jotai/index';
import { theme as storageTheme } from '@/states/global/theme.ts';
import ConfirmDialog from '@/components/Navigate/confirm-dialog.tsx';

interface MenuProps {
	isOpen: boolean | undefined;
}

export function Menu({ isOpen }: MenuProps) {
	const pathname = usePathname();
	const menuList = getMenuList(pathname);
	const [genID] = useUID();
	return (
		<ScrollArea className={cn('[&>div>div[style]]:!block')}>
			<nav className={cn('mt-8 h-full w-full')}>
				<ul className="flex flex-col min-h-[calc(100vh-48px-36px-16px-32px)] lg:min-h-[calc(100vh-32px-40px-32px)] items-start space-y-1 px-2">
					{menuList.map(({ groupLabel, menus }, index) => (
						<li className={cn("w-full", groupLabel ? "pt-5 border-t border-zinc-700 dark:border-zinc-800" : "")} key={"menu-item-"+genID()}>
							{((isOpen && groupLabel) || isOpen === undefined) ? (
								<p className="text-sm font-bold dark:text-zinc-50 text-zinc-700 text-muted-foreground px-4 pb-2 max-w-[248px] truncate">
									{groupLabel}
								</p>
							) : !isOpen && (isOpen !== undefined) && groupLabel ? (
								<TooltipProvider >
									<Tooltip delayDuration={100}>
										<TooltipTrigger className="w-full">
											<div className="w-full flex justify-center items-center">
												<Ellipsis className="h-5 w-5 dark:text-zinc-50 text-zinc-700" />
											</div>
										</TooltipTrigger>
										<TooltipContent className="bg-zinc-900 bg-opacity-70 backdrop-blur" side="right">
											<p>{groupLabel}</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							) : (
								<p className="pb-2" />
							)}
							{menus.map(
								({ href, label, icon: Icon, active, submenus }, index) =>
									submenus.length === 0 ? (
										<div className="w-full" key={'submenu-item-' + genID()}>
											<TooltipProvider disableHoverableContent>
												<Tooltip delayDuration={100}>
													<TooltipTrigger asChild>
														<Button
															asChild
															className={cn(
																'w-full justify-start h-10 mb-1 hover:bg-zinc-800 group',
																{
																	"bg-zinc-800": active,
																}
															)}
															variant="ghost"
														>
															<Link href={href}>
                                <span
																	className={cn(isOpen === false ? "" : "mr-4")}
																>
                                  <Icon className={cn(
																		'dark:text-zinc-50 text-zinc-700 group-hover:text-zinc-50',
																		{
																			"text-zinc-50": active,
																		}
																	)} size={18} />
                                </span>
																<p
																	className={cn(
																		"max-w-[200px] truncate dark:text-zinc-50 text-zinc-700",
																		isOpen === false
																			? "-translate-x-96 opacity-0"
																			: "translate-x-0 opacity-100",
																		{
																			"text-zinc-50": active,
																		}
																	)}
																>
																	{label}
																</p>
															</Link>
														</Button>
													</TooltipTrigger>
													{isOpen === false && (
														<TooltipContent className="bg-zinc-900 bg-opacity-70 backdrop-blur" side="right">
															{label}
														</TooltipContent>
													)}
												</Tooltip>
											</TooltipProvider>
										</div>
									) : (
										<div className="w-full" key={'submenu-item-' + genID()}>
											<CollapseMenuButton
												active={active}
												icon={Icon}
												isOpen={isOpen}
												label={label}
												submenus={submenus}
											/>
										</div>
									)
							)}
						</li>
					))}
					<li className="w-full grow flex items-end">
						<TooltipProvider disableHoverableContent>
							<Tooltip delayDuration={100}>
								<TooltipTrigger asChild>
									<ConfirmDialog
										description="Are you sure you want to sign out?"
										onConfirm={() => {void signOut();}}
										title="Sign out"
									>
										<Button
											className="w-full justify-center h-10 mt-5 dark:bg-zinc-50 bg-zinc-900 text-zinc-200 dark:text-zinc-900 dark:hover:bg-zinc-200 hover:bg-zinc-800 border-zinc-200 dark:border-zinc-200"
											variant="default"
										>
                    <span className={cn(isOpen === false ? "" : "mr-4")}>
                      <LogOut className="text-zinc-100 dark:text-zinc-950" size={18} />
                    </span>
											<p
												className={cn(
													"whitespace-nowrap text-zinc-100 dark:text-zinc-950",
													isOpen === false ? "opacity-0 hidden" : "opacity-100"
												)}
											>
												Sign out
											</p>
										</Button>
									</ConfirmDialog>
								</TooltipTrigger>
								{isOpen === false && (
									<TooltipContent className="bg-zinc-100 text-zinc-700 dark:text-zinc-50 dark:bg-zinc-800 bg-opacity-70 backdrop-blur" side="right">Sign out</TooltipContent>
								)}
							</Tooltip>
						</TooltipProvider>
					</li>
				</ul>
			</nav>
		</ScrollArea>
	);
}