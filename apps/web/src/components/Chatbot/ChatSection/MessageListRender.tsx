import { useSelector } from 'react-redux';
import type { RootState } from '@/redux/reducers';
import { useChatbot } from '@/providers/ChatbotContext';
import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import LaunchScreen from '@/components/Chatbot/LaunchScreen';
import { LeftChat } from '@/components/SkeletonLoad/ChatSection';
import { cn } from '@repo/utils';
import { motion } from 'framer-motion';
import { IoIosArrowDown } from 'react-icons/io';
import { useAuth } from '@/hooks/useAuth';
import useUID from '@/hooks/useUID';
import { NewChatMessageEnum } from '@/types/apps/chatbot/api.type';
import { Logo } from '@ui/Icons';
import Markdown from '@/components/Markdown';
import { Image } from '@nextui-org/react';
import Tooltip from '@/components/Tooltip';
import { AiOutlineDislike, AiOutlineLike } from 'react-icons/ai';
import { FiEdit } from 'react-icons/fi';
import Copy from '@/components/CopyToClipboard';
import markdownToTxt from 'markdown-to-txt';

type ChatMessageProps = {
	classNames?: {
		wrapper?: string;
		chatList?: string;
	};
	children?: React.ReactNode;
	role?: 'assistant' | 'user'; // Add a prop for message role
	content?: string;
	contentMedia?: string[];
	isNewMessage?: boolean;
};

const ChatMessage = forwardRef<
	React.ElementRef<'div'> & ChatMessageProps,
	React.ComponentPropsWithoutRef<'div'> & ChatMessageProps
>(({ classNames, children, role, content, contentMedia, isNewMessage = false, ...props }, ref) => {
	const isAssistant = role === 'assistant';
	const messageWrapperClass = cn('flex justify-start w-full', classNames?.wrapper || '');
	const messageListClass = cn('flex flex-col gap-1 w-full', classNames?.chatList || '');
	const { user } = useAuth();
	const [generateUID] = useUID();
	if (content === NewChatMessageEnum.NEW_MESSAGE && isAssistant) {
		return <LeftChat />;
	}

	return (
		<div className={cn('relative', messageWrapperClass, {
			'gap-2': !isAssistant,
		})} ref={ref} {...props}>
			{isAssistant ? <div className="h-8 w-8 rounded-full pt-5">
					<Logo className='h-8 w-8 fill-zinc-700 dark:fill-zinc-100' />
				</div> : null}
			<div className={messageListClass}>
				<div className={cn(
					'h-fit max-w-full rounded-xl p-5',
					{
						'bg-zinc-200 dark:bg-zinc-800 text-zinc-300 w-[calc(100vw_-_70px)] w-fit sm:max-w-[calc(100%_*_3_/_4)] md:max-w-[60%]': !isAssistant,
						'w-[calc(100vw_-_43px)]': isAssistant,
					}
				)}>
					<div
						className={cn(
							'absolute w-full h-full bottom-0 left-0 overflow-hidden ',
							isNewMessage ? 'heightToZero' : '',
							isAssistant ? 'h-0 transition-all delay-500 duration-[1000]' : 'hidden',
						)}
						style={{
							animationDuration: content && ((content.split('\n').length * 0.2 > 10) ? 10 : content.split('\n').length * 0.2) + 's',
						}}>
						<div className="h-20 bg-gradient-to-t from-zinc-50 dark:from-zinc-950" />
						<div className="h-full bg-zinc-50 dark:bg-zinc-950" />
					</div>
					<Markdown>{content ?? ""}</Markdown>
						{(!isAssistant && contentMedia?.length) ? <div className="flex p-2 m-2 gap-4 justify-start">
								{contentMedia?.map((media, index) => (
									<div className="relative w-24 h-28" key={'content-media_' + generateUID()}>
										<div
											className="w-full h-full relative rounded-xl flex justify-center items-center bg-zinc-800 overflow-hidden">
											<Image
												alt="media"
												className="w-full h-full object-cover"
												radius="lg"
												src={media}
											/>
										</div>
									</div>
								))}
							</div> : null
							}
				</div>
				<div className="w-full flex justify-start items-center gap-2">
					{isAssistant ? <>
							<Tooltip title="Like this response">
								<div
									className="p-2 rounded-full bg-zinc-200 dark:bg-zinc-800 cursor-pointer transition-all text-zinc-700 hover:bg-zinc-300 hover:text-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-white">
									<AiOutlineLike />
								</div>
							</Tooltip>
							<Tooltip title="Unlike this response">
								<div
									className="p-2 rounded-full bg-zinc-200 dark:bg-zinc-800 cursor-pointer transition-all text-zinc-700 hover:bg-zinc-300 hover:text-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-white">
									<AiOutlineDislike />
								</div>
							</Tooltip>
							<Tooltip title="Unlike this response">
								<div
									className="p-2 rounded-full bg-zinc-200 dark:bg-zinc-800 cursor-pointer transition-all text-zinc-700 hover:bg-zinc-300 hover:text-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-white">
									<FiEdit />
								</div>
							</Tooltip>
							<Tooltip title="Copy">
								<Copy
									childrenProps={{
										className:
											'p-2 aspect-square rounded-full bg-zinc-200 dark:bg-zinc-800 cursor-pointer transition-all text-zinc-700 hover:bg-zinc-300 hover:text-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-white',
									}}
									text={markdownToTxt(content ?? "")}
								/>
							</Tooltip>
						</> : null}
				</div>
			</div>
		</div>
	);
});

ChatMessage.displayName = 'ChatMessage';

export default function MessageListRender() {
	const messages = useSelector((state: RootState) => state.chat.messages);
	const { newMessageId, isNewSection, isSending, isLoadMessage } = useChatbot();
	const [isShowScrollTo, setIsShowScrollTo] = useState<boolean>(false);

	const messageWrapperRef = useRef<HTMLDivElement & ChatMessageProps>(null);
	const scrollRef = useRef<HTMLDivElement>(null);

	const scrollToMessage = () => {
		if (messageWrapperRef.current) {
			// console.log(messageWrapperRef.current);
			const messageWrapper = messageWrapperRef.current;
			messageWrapper.scrollIntoView({ behavior: 'smooth' });
		}
	};

	const checkScroll = useCallback(() => {
		if (!scrollRef.current || !messageWrapperRef.current) return;
		const scrollHeight = scrollRef.current.getBoundingClientRect().height;
		const lastMessageY = messageWrapperRef.current?.getBoundingClientRect().y;
		if (messages.length === 0) return;
		if (lastMessageY && lastMessageY < scrollHeight) {
			setIsShowScrollTo(false);
		} else {
			setIsShowScrollTo(true);
		}
	}, [messages]);

	useEffect(() => {
		const scrollEl = scrollRef.current;
		if (scrollEl) {
			scrollEl.addEventListener('scroll', checkScroll);
		}
		return () => {
			scrollEl?.removeEventListener('scroll', checkScroll);
		};
	}, [checkScroll]);

	useEffect(() => {
		setTimeout(() => {
			scrollToMessage();
		}, 1000);
	}, []);

	useEffect(() => {
		scrollToMessage();
	}, [newMessageId]);

	return (
		<>
			<div
				className=" flex flex-col items-center gap-5 overflow-hidden overflow-y-auto w-full h-full pt-10 pb-20 px-2 relative"
				ref={scrollRef}>
				{isNewSection ? (
					<LaunchScreen />
				) : (
					<div
						className="max-w-3xl w-full flex flex-col justify-center gap-5 h-fit px-2 relative">
						{isLoadMessage ? <>
								<LeftChat />
								<LeftChat
									classnames={{
										wrapper: 'flex-row-reverse',
										chatList: 'items-end',
									}}
								/>
							</> : null}
						{messages.map((message, index) => {
							return (
								<ChatMessage
									classNames={{
										wrapper: cn(
											'flex justify-start w-full',
											message.role === 'assistant' ? 'items-start' : 'items-start flex-row-reverse',
										),
										chatList: message.role === 'assistant' ? 'items-start' : 'items-end',
									}}
									content={message.message}
									contentMedia={message.contentMedia}
									id={message.id}
									isNewMessage={index === messages.length - 1}
									key={message.id}
									ref={index === messages.length - 1 ? messageWrapperRef : null}
									role={message.role}
								/>
							);
						})}
					</div>
				)}
			</div>
			<motion.div
				animate={{
					y: isShowScrollTo ? -120 : -50,
					opacity: isShowScrollTo ? 1 : 0,
				}}
				className="absolute bottom-0 cursor-pointer z-[100]"
				initial="rest"
				transition={{
					type: 'spring',
					damping: 10,
					stiffness: 100,
				}}
				variants={{
					rest: {
						y: -50,
					},
				}}>
				<div
					className="p-2 rounded-full bg-zinc-700/70 backdrop-blur border border-zinc-600"
					onClick={scrollToMessage}>
					<IoIosArrowDown />
				</div>
			</motion.div>
		</>
	);
}
