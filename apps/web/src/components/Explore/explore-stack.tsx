import {exploreList} from '@/lib/exploreList';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@ui/shadcn-ui/ui/card';
import useUID from '@/hooks/useUID';
import type { IconType } from 'react-icons';
import React from 'react';
import Image from 'next/image';
import { cn } from '@repo/utils';
import Link from 'next/link';
import { MdArrowForward } from 'react-icons/md';
import { Button } from '@nextui-org/react';

interface IconProps {
	children?: React.ReactNode | string | IconType;
}

export default function ExploreStack() {
	const [genUID] = useUID();
	return (
		<div className=" ">
			{exploreList.map(({icon: Icon, title, description,  items}, index) => (
				<Card className="mb-10 border-zinc-300 dark:border-zinc-800 rounded-xl text-zinc-700 dark:text-zinc-50" key={"explore-card-"+genUID()}>
					<CardHeader className="pb-0">
						<CardTitle className="flex items-center gap-2.5">
							{Icon ? <Icon className="w-8 h-8"/> : null}
							<p className="text-xl">{title}</p>
						</CardTitle>
						<CardDescription className="text-zinc-400">{description}</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="max-w-full overflow-x-auto relative">
							<div className="w-fit py-5 pr-5 flex gap-5 justify-start items-center text-zinc-50">
								{items?.map(({icon: ItemIcon, title: itemTitle, description: itemDescription, href}, itemIndex) => (
									(ItemIcon?.href)
										?
										<Link className="flex justify-center items-center group" href={href} key={"explore-item-" + genUID()}>
											<div className={cn("flex md:h-[100px] flex-col md:flex-row items-center w-[calc(100vw_-_100px)] md:min-w-[400px] w-fit border border-zinc-300 dark:border-zinc-700 rounded-lg overflow-hidden",)} >
												<div className="shrink-0 h-24 md:aspect-square md:h-full w-[calc(100vw_-_100px)] md:w-auto flex justify-center bg-zinc-100 dark:bg-zinc-950 p-5 border-b md:border-b-[0] md:border-r dark:border-zinc-700 border-zinc-300">
													<Image alt="image"  height={500} src={ItemIcon.href} width={500} />
												</div>
												<div className={cn("flex-grow max-w-[300px] flex flex-col items-start justify-center p-4 gap-1.5")}>
													<div className="flex justify-center center gap-4">
														<p className="text-medium text-zinc-900 dark:text-zinc-50 inline-block">
															{itemTitle}
														</p>
														<MdArrowForward className="group-hover:translate-x-2 transition-all ease-in-out" size={20} />
													</div>
													<p className="text-sm text-zinc-700 dark:text-zinc-400">{itemDescription}</p>
												</div>
											</div>
										</Link>
											: (ItemIcon?.icon)
											? <div className={cn("flex flex-col items-center min-w-[400px] gap-5 border border-zinc-300 dark:border-zinc-700 rounded-lg p-5 w-fit",)} key={"explore-item-" + genUID()}>
													<div className="w-full flex justify-between items-center relative">
														<ItemIcon.icon className="w-8 h-8 text-zinc-700 dark:text-white" />
														<Link href={href} passHref>
															<Button
																className="w-fit px-4 text-zinc-700 dark:text-white rounded-md border"
																size="sm"
																variant="bordered"
															>
																Try Now
															</Button>
														</Link>
													</div>
													<div className={cn("flex flex-col items-start justify-center")}>
													<div className="flex justify-center center gap-4">
														<p className="text-medium text-zinc-900 dark:text-zinc-50 inline-block">
															{itemTitle}
														</p>
													</div>
													<p className="text-xs text-zinc-700 dark:text-zinc-400 line-clamp-2">{itemDescription}</p>
												</div>
												</div>
											: null
								))}
							</div>
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	)
}