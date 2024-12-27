'use client';

import React, {forwardRef, useState} from 'react';
import type { LinkProps } from 'next/link';
import Link from 'next/link';
import '@ui/navbar/menu_trigger.css';
import '@ui/styles/UnderlineAnimate.css';
import * as NavigationMenuRadix from '@radix-ui/react-navigation-menu';
import { HiOutlineChatBubbleLeftRight } from 'react-icons/hi2';
import { FaMicrophone } from 'react-icons/fa';
import { LuPenLine, LuUserCheck  } from 'react-icons/lu';
import { motion } from 'framer-motion';
import { RiRobot3Line } from 'react-icons/ri';
import { cn } from '@repo/utils';
import { ModeToggle } from '@/components/Theme/theme-toggle.tsx';
import * as Icons from '@ui/Icons';
import { Button } from '@ui/shadcn-ui/ui/button';
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
	NavigationMenuViewport,
} from '@ui/shadcn-ui/ui/navigation-menu';
import UnderlineHover from '@ui/text/underline-hover';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@ui/shadcn-ui/ui/accordion';


const iconClass = 'w-10 text-xl text-zinc-400 transition-all';

// const components: { title: string; href: string; description: string, icon: React.ReactNode }[] = [];

const featureList1: { title: string; href: string; description: string, icon: React.ReactNode }[] = [
	{
		title: 'conservation',
		href: '/app/conservation',
		description: 'A platform for connecting brain to handle native language processing',
		icon: <HiOutlineChatBubbleLeftRight className={iconClass} />,
	},
	{
		title: 'assistant',
		href: '/app/chatbot',
		description: 'Answer questions, find information, and help you get things done.',
		icon: <RiRobot3Line className={iconClass} />,
	},
	{
		title: 'OCR',
		href: '/app/ocr',
		description: 'Extract text from images and documents.',
		icon: <LuPenLine className={iconClass} />,
	},
	{
		title: 'speech to text',
		href: '/app/speech-to-text',
		description: 'Convert spoken language into written text.',
		icon: <FaMicrophone className={iconClass} />
		,
	},
];

const featureList2: { title: string; href: string; description: string, icon: React.ReactNode }[] = [
	{
		title: 'identify the speaker',
		href: '/app/identify-speaker',
		description: 'Identify the speaker in a conversation via audio file.',
		icon: <LuUserCheck  className={iconClass} />,
	},
];

export function NavigationMenuDemo(): JSX.Element {
	const [currentMouseEnter, setCurrentMouseEnter] = useState<string>('');
	const [isOpenDropdown, setIsOpenDropDown] = useState<boolean>(false);
	// const openDropDownRef = useRef<HTMLInputElement>(null);

	return (
		<NavigationMenu
				className={cn(`relative z-50 bg-opacity-[0.9] bg-white dark:bg-zinc-950 backdrop-blur-[10px] text-zinc-900 dark:text-white w-full h-16 flex flex-row justify-between items-center border-0 border-b-[1px] border-zinc-400 dark:border-zinc-800`)}
				orientation="vertical"
			>
				<motion.div
					animate={{
						translateX: isOpenDropdown ? '0%' : '-100%',
						transition: {
							delay: 0.1,
							duration: 0.5,
						},
					}}
					className="md:hidden absolute z-40 w-[100vw] h-fit top-16 left-0 bg-opacity-[0.99] bg-white dark:bg-zinc-950 backdrop-blur-[10px]"
					initial={{
						translateX: '-100%',
					}}
				>
					<div className="fixed w-screen h-screen z-[30] bg-white dark:bg-zinc-900 bg-opacity-50" onClick={() => setIsOpenDropDown(false)}/>
					<div className="relative z-40 p-4 flex flex-col justify-center items-start gap-4">
						<div className="w-full pr-4">
							<Accordion className="w-full" collapsible type="single">
								<AccordionItem value="item-1">
									<AccordionTrigger className="text-sm font-normal">Productions</AccordionTrigger>
									<AccordionContent>
										{[...featureList1, ...featureList2].map((feature, index) => (
											<Link
												className="pl-2 underline_animate_hover dropdown_content-item flex justify-between items-center gap-3 mb-[6px] cursor-pointer"
												href={feature.href}
												key={`feature1-${  index}`}
												passHref>

												<div className="flex flex-col justify-center items-start">
													<span
														className="underline_animate dropdown_content-item-title capitalize font-normal text-zinc-950 dark:text-white text-md">{feature.title}</span>
													{/*<span className={'text-zinc-400 text-sms'}>{feature.description}</span>*/}
												</div>
												<div
													className="w-[35px] h-[35px] text-white transition-all flex justify-center items-center rounded-lg backdrop-blur-[4px]">
													{feature.icon}
												</div>
											</Link>
										))}

									</AccordionContent>
								</AccordionItem>
							</Accordion>
						</div>
						<Link className="block" href="/auth/method?type=login" passHref>
							{/*<NavigationMenuLink className={cn(navigationMenuTriggerStyle(), 'font-bold')}>*/}
							<Button
								className="font-normal border-zinc-400 text-zinc-700 hover:text-zinc-900 dark:bg-zinc-100 hover:bg-zinc-200 transition-colors"
								variant='default'>
								Login
							</Button>
							{/*</NavigationMenuLink>*/}
						</Link>
						<Link className="block p-0 w-fit h-fit rounded-full text-zinc-900 dark:text-zinc-200" href="/auth/method?type=register" passHref>
							{/*<NavigationMenuLink*/}
							{/*	className={cn(navigationMenuTriggerStyle(), ' ')}>*/}
							<Button
								className="font-normal rounded-lg border-zinc-400 transition-colors dark:hover:bg-zinc-100 hover:bg-zinc-200 text-zinc-50 hover:text-zinc-900"
								variant="outline">Register</Button>
							{/*</NavigationMenuLink>*/}
						</Link>
					</div>
				</motion.div>
				<NavigationMenuList className="flex gap-3 pl-3 sm:pl-8 md:pl-16">
					<Link href="/" passHref>
						<div className="flex flex-row justify-center items-center gap-2">
							<Icons.Logo className="h-[40px] w-[40px] fill-zinc-900 dark:fill-zinc-200" />
							<span className="flex flex-col justify-center items-start font-bold text-lg capitalize leading-4">
							<span className="">Connected</span>
							<span>Brain</span>
						</span>
						</div>
					</Link>
					<div className="space-x-2" />
					<NavigationMenu className="hidden ml-12 md:flex">
						<NavigationMenuList>
							<NavigationMenuItem className="hover:bg-zinc-100 dark:hover:bg-zinc-800/70 rounded-lg transition-all">
								<NavigationMenuTrigger>Products</NavigationMenuTrigger>
								<NavigationMenuContent
									className={cn('absolute bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-800',
										'radix-motion-from-start:animate-enter-from-left',
										'radix-motion-from-end:animate-enter-from-right',
										'radix-motion-to-start:animate-exit-to-left',
										'radix-motion-to-end:animate-exit-to-right')}>
									<div className="flex flex-col md:w-[500px] lg:w-[600px] ">
										<div className="grid grid-cols-2 p-2">
											{featureList1.map((feature, index) => (
												<div className="row-span-3"
														 key={`feature-${index}`}
														 onMouseEnter={() => {
															 setCurrentMouseEnter(feature.title);
														 }}
														 onMouseLeave={() => {
															 setCurrentMouseEnter('');
														 }}
												>
													<NavigationMenuLink asChild>
														<Link className="flex select-none flex-row justify-end rounded-md leading-none no-underline outline-none transition-colors "
																	href={feature.href}
																	passHref>
															<div
																className="flex flex-row justify-center items-center gap-2 p-3 rounded-lg hover:bg-zinc-100/80 dark:hover:bg-zinc-700/20 transition-colors">
																<div className="">
																	{feature.icon}
																</div>
																<div className="flex flex-col justify-center items-start gap-1">
																	<UnderlineHover isMouseEnter={currentMouseEnter === feature.title}>
																		<div className="text-md font-bold leading-none capitalize dark:text-zinc-100 text-zinc-800">{feature.title}</div>
																	</UnderlineHover>
																	<p className="line-clamp-2 text-xs text-zinc-600 dark:text-zinc-400 leading-snug text-muted-foreground">
																		{feature.description}
																	</p>
																</div>
															</div>
														</Link>
													</NavigationMenuLink>
												</div>
											))}
										</div>
										<div className="w-full h-0 border-0 border-b-[1px] border-zinc-400 dark:border-zinc-800" />
										<div className="grid grid-cols-2 p-2">
											{featureList2.map((feature, index) => (
												<div className="row-span-3"
														 key={`feature-${  index}`}
														 onMouseEnter={() => {
															 setCurrentMouseEnter(feature.title);
														 }}
														 onMouseLeave={() => {
															 setCurrentMouseEnter('');
														 }}
												>
													<NavigationMenuLink asChild>
														<Link className="flex select-none flex-row justify-end rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground" href={feature.href}
																	passHref>
															<div
																className="flex flex-row justify-center items-center gap-2 p-3 transition-all rounded-lg hover:bg-zinc-200/80 dark:hover:bg-zinc-700/20 transition-colors">
																<div className="">
																	{feature.icon}
																</div>
																<div className="flex flex-col justify-center items-start gap-1">
																	<UnderlineHover isMouseEnter={currentMouseEnter === feature.title}>
																		<div className="text-md font-bold leading-none capitalize">{feature.title}</div>
																	</UnderlineHover>
																	<p className="line-clamp-2 text-xs text-zinc-900 dark:text-zinc-400 leading-snug text-muted-foreground">
																		{feature.description}
																	</p>
																</div>
															</div>
														</Link>
													</NavigationMenuLink>
												</div>))}
										</div>
									</div>
								</NavigationMenuContent>
								{/*<NavigationMenuViewport />*/}
							</NavigationMenuItem>
							<NavigationMenuItem className="hover:bg-zinc-100 dark:hover:bg-zinc-800/70 rounded-lg transition-all">
								<NavigationMenuTrigger>Solutions</NavigationMenuTrigger>
								<NavigationMenuContent className={cn('absolute bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-800',
									'radix-motion-from-start:animate-enter-from-left',
									'radix-motion-from-end:animate-enter-from-right',
									'radix-motion-to-start:animate-exit-to-left',
									'radix-motion-to-end:animate-exit-to-right')}>
									<div className="flex w-[400px] gap-3 p-12 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
										<div className="flex flex-col w-full gap-1 border-0 border-r-[1px] border-zinc-800 pr-2">
											<span className="font-bold text-xl">Connected Brain</span>
											<span className="text-sm text-zinc-400">
											We have laid the groundwork for a versatile solution, combining advanced technologies to enhance user experience and optimize workflows.
										</span>
										</div>
										<div className="flex flex-col justify-center items-start w-full gap-1">
											{featureList1.map((component, index) => (
												<span
													className="font-bold text-md text-zinc-300 capitalize transition-all hover:text-white hover:scale-110"
													key={`featurelist1-${  index}`}>
													<Link href={component.href} passHref>
														{component.title}
													</Link>
												</span>
											))}
											{featureList2.map((component, index) => (
												<span
													className="font-bold text-md text-zinc-300 capitalize transition-all hover:text-white hover:scale-110"
													key={`featurelist2-${  index}`}>
													<Link href={component.href} passHref>
														{component.title}
													</Link>
												</span>
											))}
										</div>
									</div>
								</NavigationMenuContent>
							</NavigationMenuItem>
							<NavigationMenuItem className="hover:bg-zinc-100 dark:hover:bg-zinc-800/70 rounded-lg transition-all">
								<Link href="/docs" legacyBehavior passHref>
									<NavigationMenuLink className={cn(navigationMenuTriggerStyle(), '')}>
										Documentation
									</NavigationMenuLink>
								</Link>
							</NavigationMenuItem>
							<NavigationMenuRadix.Indicator className={cn(
								'z-10 relative',
								'top-[100%] flex items-end justify-center h-2',
								'radix-state-visible:animate-fade-in',
								'radix-state-hidden:animate-fade-out',
								'transition-[width_transform] duration-[250ms] ease-[ease]',
							)}>
								<div
									className="top-1 relative w-4 h-4">
									<svg className="stroke-zinc-400 fill-zinc-50 dark:stroke-zinc-800 dark:fill-zinc-900" fill="inherit" height="21" viewBox="0 0 22 21" width="22"
											 xmlns="http://www.w3.org/2000/svg">
										<path
											// fill="#030712" stroke="white"
											d="M3.864 5.644c-3.573 2.042-3.72 7.14-.272 9.386l1.211.788A4.45 4.45 0 0 1 6.157 17.2l.307.495c2.086 3.361 7.034 3.185 8.875-.316a4.117 4.117 0 0 1 1.53-1.615l1.033-.62c3.683-2.204 3.533-7.59-.267-9.587l-.594-.312a3.99 3.99 0 0 1-1.735-1.793C13.556-.162 8.472-.335 6.48 3.15l-.269.47A4.276 4.276 0 0 1 4.62 5.211l-.757.432Z" />
									</svg>
								</div>
							</NavigationMenuRadix.Indicator>
							<div
								className={cn(
									'absolute flex justify-center',
									'w-[140%] left-[0] top-[100%]',
								)}
								style={{
									perspective: '2000px',
								}}
							>
								<NavigationMenuViewport
									className={cn(
										'relative bg-opacity-[0.99] backdrop-blur bg-[#16181b] top-[10%] shadow-lg rounded-md  overflow-hidden',
										'w-radix-navigation-menu-viewport',
										'h-radix-navigation-menu-viewport',
										'radix-state-open:animate-scale-in-content',
										'radix-state-closed:animate-scale-out-content',
										'origin-[top_center] transition-[width_height] duration-300 ease-[ease]',
									)}
								/>
							</div>
						</NavigationMenuList>
					</NavigationMenu>
				</NavigationMenuList>

				<NavigationMenuList />
				<NavigationMenuList>
					<NavigationMenuItem className="hidden md:flex flex-row justify-center items-center gap-1 bg-transparent">
						<Link href="/auth/method?type=login" passHref>
							<NavigationMenuLink className={cn(navigationMenuTriggerStyle(), 'font-bold')}>
								Login
							</NavigationMenuLink>
						</Link>
						<Link className="block" href="/auth/method?type=register" passHref>
							<NavigationMenuLink
								className={cn(navigationMenuTriggerStyle(), 'w-fit h-fit rounded-xl text-zinc-200 bg-transparent')}>
								<Button
									className="font-bold border-zinc-300 text-zinc-800 dark:text-zinc-50 dark:border-zinc-700 transition-colors dark:hover:bg-zinc-800 hover:bg-zinc-100 dark:hover:text-zinc-50 hover:text-zinc-900"
									variant="outline">Register</Button>
							</NavigationMenuLink>
						</Link>
					</NavigationMenuItem>
					<NavigationMenuItem className="">
						<div className="md:pr-2">
							<ModeToggle />
						</div>
					</NavigationMenuItem>
					<NavigationMenuItem className="block md:hidden px-3">
						{/*<NavbarMobileDropdown />*/}
						<div className="flex justify-center items-center px-1.5 py-1 border-[1px] border-zinc-800 rounded-lg">
							<label className="hamburger" htmlFor="navbar-hamburger">
								<input
									className="outline-none"
									id="navbar-hamburger"
									onChange={(e) => {
										console.log(e.target.checked);
										setIsOpenDropDown(e.target.checked);
									}}
									type="checkbox"
								/>
								<svg className="w-[26px] h-[26px]" viewBox="0 0 32 32">
									<path className="line line-top-bottom"
												d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22" />
									<path className="line" d="M7 16 27 16" />
								</svg>
							</label>
						</div>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>
	);
}

const ListItem = forwardRef<
	React.ElementRef<'a'>,
	React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
	return (
		<div>
			<NavigationMenuLink asChild>
				<Link
					ref={ref}
					{...props as LinkProps}
					passHref
				>
					<div className={cn(
						'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
						className,
					)}>
						<div className="text-sm font-medium leading-none">{title}</div>
						<p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
							{children}
						</p>
					</div>
				</Link>
			</NavigationMenuLink>
		</div>
	);
});
ListItem.displayName = 'ListItem';
