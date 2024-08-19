'use client';
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { cn } from '@repo/utils';
import { FiMessageSquare } from 'react-icons/fi';
import { SlOptionsVertical } from 'react-icons/sl';
import { HiOutlineDocumentPlus } from 'react-icons/hi2';
import { IoIosSearch } from 'react-icons/io';
import { HiPencil } from 'react-icons/hi';
import { RiDeleteBin7Line } from 'react-icons/ri';
import Tooltip from '@/components/Tooltip';
import { useChatbot } from '@/providers/ChatbotContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, useAnimate } from 'framer-motion';
import { TfiAngleDown, TfiAngleLeft, TfiAngleRight, TfiAngleUp } from 'react-icons/tfi';
import type { SectionMessageGeneratedType } from 'types/apps/chatbot/api.type.ts';
import DownloadModal from '@/components/Chatbot/Modals/DownloadModal';
import { Button } from '@ui/shadcn-ui/ui/button';

interface ChatHistoryProps {
	classnames?: {
		wrapper?: string;
		container?: string;
	};
	isOpenedWhenMobile?: boolean;
}

const variants = {
	forward_to_left: {
		x: 0,
		transition: {
			duration: 0.5,
		},
	},
	forward_to_bottom: {
		y: 0,
		transition: {
			duration: 0.5,
			delay: 0.6,
		},
	},
};

const SearchIcon = forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(
	(props, ref) => (
		<div ref={ref} {...props}>
			<IoIosSearch className="w-6 h-6 cursor-pointer" />
		</div>
	),
);
SearchIcon.displayName = 'SearchIcon';

const ChatHistoryItem = ({
	title,
	startContent,
	endContent,
	isActive = false,
	sectionId,
}: {
	title: string;
	startContent?: React.ReactNode;
	endContent?: React.ReactNode;
	isActive?: boolean;
	sectionId: string;
}) => {
	const router = useRouter();
	const { updateChatHistory } = useChatbot();

	const [enableEditTile, setEnableEditTile] = useState(false);
	const sectionTitleRef = useRef<HTMLInputElement>(null);
	const [isEditing, setIsEditing] = useState(false);
	const [sectionTitle, setSectionTitle] = useState<string>(
		title.slice(0, 20) + (title.length > 20 ? '...' : ''),
	);
	const [isUpdate, setIsUpdate] = useState<boolean>(false);

	const directToSection = (sectionId: string) => {
		if (!isEditing) {
			router.push(`/app/chatbot?id=${sectionId}`);
		}
	};

	const updateSectionName = async () => {
		await updateChatHistory(sectionId, { section_name: sectionTitle });
	};

	useEffect(() => {
		if (sectionTitleRef.current) {
			sectionTitleRef.current.type = isEditing ? 'text' : 'text';
			sectionTitleRef.current.value = isEditing
				? title
				: title.slice(0, 20) + (title.length > 20 ? '...' : '');
			if (isEditing) {
				sectionTitleRef.current.focus();
			}
		}
	}, [isEditing]);

	return (
		<div className="w-full flex justify-between overflow-hidden gap-1 ">
			<div
				className={cn(
					'flex w-full max-w-sm p-2 px-4 rounded-xl gap-2 justify-between items-center hover:bg-zinc-800 transition-all duration-300 cursor-pointer',
					isActive ? 'bg-zinc-800 ' : '',
				)}>
				<div className="flex justify-start items-center w-full">
					<div className="text-white" onClick={() => directToSection(sectionId)}>
						{startContent || <FiMessageSquare className="w-4 h-4 font-bold text-gray-400" />}
					</div>
					<div
						className="w-full text-start relative pl-2"
						onClick={() => directToSection(sectionId)}>
						<input
							className={cn(
								'w-full outline-none bg-inherit text-gray-400 relative text-start',
								isEditing ? '' : 'cursor-pointer',
							)}
							onBlur={() => {
								if (isEditing) {
									void updateSectionName();
									setEnableEditTile(false);
									setIsEditing(false);
								}
							}}
							onChange={e => {
								setSectionTitle(e.target.value);
							}}
							onKeyDown={async e => {
								if (e.key === 'Enter') {
									if (isEditing) {
										await updateSectionName();
										setEnableEditTile(false);
										setIsEditing(false);
									}
								}
							}}
							readOnly={!isEditing}
							ref={sectionTitleRef}
							type="text"
							value={sectionTitle}
						/>
					</div>
				</div>
				<div className="text-white" onClick={() => setEnableEditTile(prev => !prev)}>
					{endContent || (
						<div className="relative">
							<Tooltip title="Chat options">
								<div className="text-gray-600 hover:text-gray-200 p-1 transition-all">
									<SlOptionsVertical className="w-4 h-4" />
								</div>
							</Tooltip>
						</div>
					)}
				</div>
			</div>
			<div
				className={cn(
					'flex transition-all duration-300 cursor-pointer',
					enableEditTile ? 'w-20' : 'w-0',
				)}>
				<div className="w-20 h-10 bg-zinc-800 rounded-xl text-gray-400 flex">
					<Tooltip title="Edit">
						<div
							className="w-full h-full flex justify-center items-center hover:text-gray-200 transition-all border-r border-zinc-800">
							<HiPencil
								className="w-6 h-6"
								onClick={() => {
									setIsEditing(true);
									setEnableEditTile(true);
								}}
							/>
						</div>
					</Tooltip>
					<Tooltip title="Delete session">
						<div
							className="w-full h-full flex justify-center items-center hover:text-gray-200 transition-all">
							<RiDeleteBin7Line className="w-6 h-6" />
						</div>
					</Tooltip>
				</div>
			</div>
		</div>
	);
};

function ChatSectionList({
	sections,
	chatHistoryCollapsed,
}: {
	sections: SectionMessageGeneratedType[];
	chatHistoryCollapsed: boolean;
}) {
	const params = useSearchParams();
	const chat_id = params.get('id');

	return (
		<div
			className={cn(
				'w-full max-h-72 transition-all overflow-x-hidden overflow-y-auto',
				chatHistoryCollapsed ? 'w-0 h-0 overflow-hidden' : '',
			)}>
			<div className="h-full">
				{sections.map((message, index) => (
					<div
						className="flex flex-col m-0 w-full h-10"
						key={'chat-history-' + String(message?._id ?? "")}>
						<ChatHistoryItem
							isActive={chat_id ? (String(message?._id ?? "") === chat_id) : undefined}
							sectionId={String(message?._id ?? "")}
							title={message.section_name}
						/>
					</div>
				))}
			</div>
		</div>
	);
}

function ChatHistory({ classnames }: ChatHistoryProps) {
	const router = useRouter();
	const { sections } = useChatbot();
	const [CHRef, animate] = useAnimate(); // CHRef: Chat History Ref

	const [sectionRendered, setSectionRendered] = React.useState<SectionMessageGeneratedType[]>(
		sections.slice(0, 5),
	);

	const [showMore, setShowMore] = useState<boolean>(false);
	const [chatHistoryCollapsed, setChatHistoryCollapsed] = useState(false);
	const [isCollapsed, setIsCollapsed] = useState(true);

	const [searchValue, setSearchValue] = useState('');
	const searchRef = useRef<HTMLInputElement>(null);

	const filterItems = (value: string) => {
		const filteredItems = sectionRendered.filter(section =>
			section.section_name.toLowerCase().includes(value.toLowerCase()),
		);
		setSectionRendered(filteredItems);
	};

	useEffect(() => {
		router.prefetch('/app/chatbot');
	}, []);

	useEffect(() => {
		void (async () => {
			if (chatHistoryCollapsed) {
				await animate(CHRef.current, variants.forward_to_left);
				await animate(CHRef.current, variants.forward_to_bottom);
			}
		})();
	}, [CHRef, animate, chatHistoryCollapsed]);

	useEffect(() => {
		if (showMore) {
			setSectionRendered(sections);
		} else {
			setSectionRendered(sections.slice(0, 5));
		}
	}, [sections, showMore]);

	return (
		<div
			className={cn(
				' flex flex-col justify-between transition-all bottom-0 z-[60] w-full md:max-w-xs md:h-full md:relative md:p-5 md:pr-0',
				chatHistoryCollapsed ? 'w-fit gap-0' : '',
				classnames?.wrapper || '',
			)}>
			{/*<div className={'w-screen h-screen absolute top-0 left-0 bg-black/40 z-[121] md:hidden'} />*/}
			<div
				className={cn(
					'bg-[--background-hero] flex flex-col justify-between border border-zinc-800 gap-1 shadow w-full md:h-full md:rounded-2xl rounded-3xl rounded-b-none p-2 max-w-lg mx-auto select-none transition-all',
					chatHistoryCollapsed ? 'w-fit' : '',
					classnames?.container || '',
				)}>
				{/*<div className={'w-full h-10 text-end md:hidden flex justify-end mb-1'}>*/}
				{/*	<div className={'rounded-full w-8 h-8 hover:bg-gray-800 flex justify-center items-center'}>*/}
				{/*		<LiaTimesSolid className={'text-white'} />*/}
				{/*	</div>*/}
				{/*</div>*/}
				<div className="h-full w-full">
					<div className={cn(' flex flex-col justify-start items-center', showMore && 'h-full')}>
						<div
							className={cn(
								'w-full flex justify-between select-none mb-4 transition-all gap-2',
								chatHistoryCollapsed ? 'w-fit gap-2' : '',
								isCollapsed ? '' : 'gap-0',
							)}>
							<Tooltip title={chatHistoryCollapsed ? 'Show History' : 'Hide history'}>
								<motion.div
									className={cn(
										'relative w-10 h-10 bg-zinc-800 flex justify-center items-center rounded-xl transition-all duration-300 cursor-pointer',
										'hover:bg-gray-700 hidden md:flex',
										isCollapsed ? '' : 'w-0 ',
									)}
									initial="rest"
									onClick={() => setChatHistoryCollapsed(prev => !prev)}
									ref={CHRef}>
									{chatHistoryCollapsed ? <TfiAngleLeft /> : <TfiAngleRight />}
								</motion.div>
							</Tooltip>
							<div
								className={cn(
									'rounded-xl bg-zinc-800 h-10 w-full md:w-64 flex justify-center items-center px-3 transition-all duration-300',
									chatHistoryCollapsed ? 'md:w-10 p-0' : '',
									isCollapsed ? '' : 'w-full',
								)}
								// onMouseEnter={() => setIsCollapsed(false)}
							>
								<Tooltip title="search">
									<SearchIcon
										className={
											chatHistoryCollapsed
												? 'w-10 h-10 flex justify-center items-center transition-all hover:bg-gray-700 rounded-xl'
												: ''
										}
										onClick={() => {
											if (!searchValue) {
												searchRef?.current && searchRef.current.focus();
											} else {
												filterItems(searchValue);
											}
											// setIsCollapsed(false);
										}}
									/>
								</Tooltip>
								<input
									className={cn(
										'outline-none bg-inherit h-10 ml-2 ',
										chatHistoryCollapsed ? ' ml-0 hidden' : 'w-full',
									)}
									onBlur={() => setIsCollapsed(true)}
									onChange={e => setSearchValue(e.target.value)}
									onFocus={() => setIsCollapsed(false)}
									placeholder="Search..."
									ref={searchRef}
								/>
							</div>
						</div>
						<Tooltip title="Create session">
							<div
								className={cn(
									'relative w-full h-10 bg-zinc-800 flex justify-center items-center rounded-xl transition-all duration-[300] cursor-pointer',
									'hover:bg-zinc-700',
									chatHistoryCollapsed ? 'w-[88px] p-0' : '',
								)}
								onClick={() => router.push('/app/chatbot')}>
								<HiOutlineDocumentPlus className="w-6 h-6" />
								<span
									className={cn(
										'text-white leading-5 transition-all',
										chatHistoryCollapsed ? 'w-0 invisible overflow-hidden' : 'ml-2 w-fit',
									)}>
									Create New Session
								</span>
							</div>
						</Tooltip>
						<div
							className={cn(
								'w-full px-2 pt-2 transition-all',
								chatHistoryCollapsed ? 'w-0 invisible' : '',
							)}>
							<span className="font-semibold">Recent</span>
						</div>
						<div className="w-full flex justify-center items-center">
							<ChatSectionList
								chatHistoryCollapsed={chatHistoryCollapsed}
								sections={sectionRendered}
							/>
						</div>

						<div className="w-full h-fit p-2 flex justify-center items-center">
							{/* <button
								className={cn(
									'text-white bg-gray-800 rounded-xl p-2 transition-all duration-300 cursor-pointer',
									chatHistoryCollapsed ? 'w-0 h-0 hidden' : '',
								)}
								onClick={() => setShowMore(prev => !prev)}>
								{showMore ? <TfiAngleUp /> : <TfiAngleDown />}
							</button> */}
							<Button
								className={cn(
									'text-white bg-zinc-800 rounded-xl transition-all duration-300 cursor-pointer hover:bg-zinc-700',
									chatHistoryCollapsed ? 'w-0 h-0 hidden' : '',
								)}
								onClick={() => setShowMore(prev => !prev)}>
								{showMore ? <TfiAngleUp /> : <TfiAngleDown />}
							</Button>
						</div>
					</div>
				</div>
				<div
					className="w-full rounded-xl p-1  hover:bg-zinc-700 flex justify-center items-center bg-zinc-800">
					<DownloadModal chatHistoryCollapsed={chatHistoryCollapsed} />
				</div>
			</div>
		</div>
	);
}

export default ChatHistory;
