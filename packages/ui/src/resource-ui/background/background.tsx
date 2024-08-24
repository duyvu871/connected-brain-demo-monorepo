import React from 'react';
import { cn } from '@repo/utils';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Button } from '@ui/shadcn-ui/ui/button';

const borderDashStyle = 'border-0 border-dashed border-gray-800';
const roundedOneFourth = 'relative after:border-0 after:border-dashed after:border-gray-800 after:rounded-[100%_0%_0%_100%_/_100%_0%_100%_0%] after:w-10 after:h-10 after:content-normal after:absolute after:bottom-0 after:right-0';

function Background(): JSX.Element {

	const userSession = useSession();

	return (
		<div className="px-4 md:px-20 pt-10 select-none  ">
			<div className="flex flex-col">
				<div className="grid grid-cols-[1fr_12fr_1fr]">
					<div className={cn(
						borderDashStyle,
						'h-14 border-b-[1px] border-r-[1px] relative',
						roundedOneFourth, 'after:border-l-[1px] after:border-t-[1px]',
					)} />
					<div className={cn(
						borderDashStyle,
						'h-14 border-b-[1px] flex justify-center items-center',
						roundedOneFourth,
						'after:rounded-[0%_100%_100%_0%_/_0%_100%_0%_100%] after:border-t-[1px] after:border-r-[1px] after:bottom-0 after:left-0',
					)}>
						<div className={cn(borderDashStyle, 'w-64 h-14 border-r-[1px] border-l-[1px]')} />
					</div>
					<div className={cn(borderDashStyle, 'h-14 border-b-[1px] border-l-[1px]')} />
				</div>

				<div className="grid grid-cols-[1fr_12fr_1fr] grid-rows-1 h-fit">
					<div className={cn(
						borderDashStyle,
						' border-b-[1px] border-r-[1px]',
						roundedOneFourth,
						'after:rounded-[0%_100%_0%_100%_/_0%_0%_100%_100%] after:border-l-[1px] after:border-b-[1px] after:top-0 after:right-0',
					)} />
					<div className={cn(borderDashStyle, ' border-b-[1px]')}>
						<div className="p-6 w-full h-full flex flex-col justify-start items-center gap-6">
							<span
								className="text-blue-400 text-5xl flex justify-center items-center font-bold">
								{/*<WavyText*/}
								{/*	text={'Connected Brain'}*/}
								{/*	className={'text-blue-400 text-5xl flex justify-center items-center font-bold z-20'}*/}
								{/*	letterProps={{*/}
								{/*		className: 'text-[#fff]',*/}
								{/*	}}*/}
								{/*/>*/}
								{/*<BottomTextUp text={'Connected Brain'} />*/}
								Connected Brain
							</span>
							<span
								className=" text-[rgb(255_255_255_/_0%)] text-3xl flex justify-center items-center font-bold bg-[linear-gradient(180deg,#fff,#adadad)] bg-clip-text">
								{/*<WavyText*/}
								{/*	text={'The Connected Platform for Native Data handle'}*/}
								{/*	className={'text-[rgb(255_255_255_/_0%)] bg-[linear-gradient(180deg,#fff,#adadad)] text-3xl bg-clip-text font-bold'}*/}
								{/*	letterProps={{*/}
								{/*		className: 'text-[#fff]',*/}
								{/*	}}*/}
								{/*	duration={0.025}*/}
								{/*/>*/}
								The Connected Platform for Native Data handle
						</span>
						</div>
					</div>
					<div className={cn(borderDashStyle, ' border-b-[1px] border-l-[1px]')} />
				</div>

				<div className="grid grid-cols-[1fr_12fr_1fr] grid-rows-1 h-fit">
					<div className={cn(borderDashStyle, ' border-b-[1px] border-r-[1px]')} />
					<div className={cn(borderDashStyle, ' border-b-[1px]')}>
						<div className="p-6 w-full h-full flex flex-col justify-start items-center gap-3">
							<span className=" text-gray-400 text-md flex justify-center items-center font-semibold">
								{/*<TextTyping planText={'Unlocking Tomorrow’s Potential with Intelligent Data Insights'.split(' ')} />*/}
								Unlocking Tomorrow’s Potential with Intelligent Data Insights
							</span>
						</div>
					</div>
					<div className={cn(borderDashStyle, ' border-b-[1px] border-l-[1px]')} />
				</div>

				<div className="grid grid-cols-[1fr_12fr_1fr] grid-rows-1 h-fit">
					<div className={cn(borderDashStyle, ' border-b-[1px] border-r-[1px]')} />
					<div className={cn(borderDashStyle, ' border-b-[1px]')}>
						<div className={cn(
							'relative w-full h-full flex flex-col justify-start items-center gap-3 ',
							'')}>
							<div
								className={cn(
									'relative',
									'after:border-r-[1px] after:content-normal after:border-dashed after:border-gray-800 after:h-14 after:absolute after:top-[100%] ',
									'before:border-r-[1px] before:content-normal before:border-dashed before:border-gray-800 before:h-14 before:absolute before:top-[100%] before:right-0',
									// roundedOneFourth,
								)}>
								<div
									className={cn(borderDashStyle,
										'border-r-[1px] border-l-[1px] p-8 ',
									)}>
								<span className="capitalize text-gray-400 text-2xl flex justify-center items-center font-semibold">
									<Link href={userSession.status === 'authenticated' ? '/explore' : '/auth/method?type=register'} passHref>
											<Button
												className="capitalize flex justify-center items-center p-6 px-4 font-extrabold rounded-2xl rounded-tr-[0] rounded-bl-[0] text-xl bg-gray-200 text-zinc-800 transition-colors hover:bg-opacity-90"
												variant="outline">
												Start Now
														{/*<IoIosArrowRoundForward className={'text-4xl'} />*/}
											</Button>
									</Link>
								</span>
								</div>
							</div>
						</div>
					</div>
					<div className={cn(borderDashStyle, ' border-b-[1px] border-l-[1px]')} />
				</div>
				<div className="grid grid-cols-[1fr_12fr_1fr]">
					<div className={cn(borderDashStyle, 'h-14 border-r-[1px]')} />
					<div className={cn(borderDashStyle, 'h-14')} />
					<div className={cn(borderDashStyle, 'h-14 border-l-[1px]')} />
				</div>
			</div>
		</div>
	);
}

export default Background;
