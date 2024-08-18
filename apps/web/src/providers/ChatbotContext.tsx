'use client';
import React, { createContext, useCallback, useContext, useLayoutEffect, useState } from 'react';
import store from '@/redux/store';
import {
	insertMessage as InsertMessageAction,
	loadChat,
	updateChatById as UpdateChatByIdAction,
} from '@/redux/actions/ChatbotAtion';
import type {
	CreateNewSectionResponse,
	SendMessageRequest,
	UpdateSectionRequest,
	UpdateSectionResponse,
	MessageHistoryType,
	SectionMessageGeneratedType
} from 'types/apps/chatbot/api.type';
import {
	NewChatMessageEnum,
} from '@/types/apps/chatbot/api.type.ts';

import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import type { UserInterface, UserSessionPayload } from 'types/user.type';
import { APIs } from '@/global/contants/route';
import type { ObjectId } from 'mongodb';
import useUID from '@/hooks/useUID';
import { useToast } from '@/hooks/useToast.ts';


interface Message {
	id: string;
	sender: 'user' | 'bot';
	text: string;
}

interface ChatbotContextType {
	isLoadMessage: boolean;
	newMessageId: string;
	promptText: string;
	contentMedia: string[];
	setContentMedia: React.Dispatch<React.SetStateAction<string[]>>;
	setPromptText: (prompt: string) => void;
	messages: Message[];
	sections: SectionMessageGeneratedType[];
	isNewSection: boolean;
	isSending?: boolean;
	sendMessage: (text: string, mediaContent: string[]) => Promise<void>;
	clearMessages: () => void;
	insertMessage: (text: string, contentMedia: string[], sender: 'user' | 'assistant', chat_id: string) => void;
	createSectionMessage: (message: string) => Promise<void>;
	updateChatHistory: (chat_id: string, update_data: UpdateSectionRequest['update_data']) => Promise<UpdateSectionResponse['data']>;
}

const defaultContext: ChatbotContextType = {
	isLoadMessage: false,
	newMessageId: '',
	contentMedia: [],
	promptText: '',
	setContentMedia: () => {
	},
	setPromptText: () => {
	},
	isNewSection: false,
	isSending: false,
	messages: [],
	sections: [],
	sendMessage: async () => {
	},
	clearMessages: () => {
	},
	insertMessage: () => {
	},
	createSectionMessage: async () => {
	},
	// eslint-disable-next-line @typescript-eslint/require-await
	updateChatHistory: async () => ({
		insertedId: '',
		modifiedData: {},
		error: '',
	} as UpdateSectionResponse['data']),
};

const ChatbotContext = createContext<ChatbotContextType | null>(defaultContext);

function ChatbotProvider({ children }: { children: React.ReactNode }) {
	const {error: errorShowToast} = useToast();
	const router = useRouter();
	const params = useSearchParams();
	const {user: userSession } = useAuth();
	const [chat_id, setChatId] = useState<string>('');
	const [user, setUser] = useState<UserInterface|null>(userSession);
	const [generateUID] = useUID();
	// const { _id, role, username, uid } = user;
	const [contentMedia, setContentMedia] = useState<string[]>([]);

	const [messages, setMessages] = useState<Message[]>([]);
	const [sections, setSections] = useState<SectionMessageGeneratedType[]>([]);
	const [promptText, setPromptText] = useState<string>('');
	const [newMessageId, setNewMessageId] = useState<string>('');

	const [isNewSection, setIsNewSection] = useState<boolean>(false);
	const [isSending, setIsSending] = useState<boolean>(false);
	const [isLoadMessage, setIsLoadMessage] = useState<boolean>(false);

	const clearMessages = () => {
		store.dispatch(loadChat({
			messages: [],
		}));
	};

	const insertMessage = (text: string, contentMedia: string[], sender: 'user' | 'assistant', chat_id: string) => {
		store.dispatch(InsertMessageAction(text, contentMedia, sender, chat_id));
	};

	const updateMessage = (text: string, chat_id: string) => {
		store.dispatch(UpdateChatByIdAction(text, chat_id));
	};

	const sendMessage = async (text: string, mediaContent: string[] = []) => {
		if (!chat_id) {
			await createSectionMessage(text);
			return;
		}
		insertMessage(text, mediaContent, 'user', chat_id);
		const newMessageId = 'new_message_' + generateUID();
		insertMessage(NewChatMessageEnum.NEW_MESSAGE, [], 'assistant', newMessageId);
		setIsSending(true);
		const response = await fetch('/api/v1/feature/chatbot/send-message', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				message: text,
				messageMedia: mediaContent,
				section_id: chat_id,
				user_id: user?.id,
			} as SendMessageRequest),
		});
		setContentMedia([]);
		const data = await response.json() as MessageHistoryType & { error?: string };
		if (response.status !== 200) {
			console.error(data);
			errorShowToast(data.error ?? 'Error');
			return;
		}
		setIsSending(false);
		// insertMessage(data.message, 'assistant', chat_id);
		setNewMessageId(newMessageId);
		updateMessage(data.message, newMessageId);
	};

	const getSections = useCallback(async (user_id: string) => {
		if (!user_id) {
			// console.error('User id not found');
			return;
		}
		const response = await fetch('/api/v1/feature/chatbot/get-sections?user_id=' + user_id);
		const data = await response.json() as { data: SectionMessageGeneratedType[]; error?: string };
		if (response.status !== 200) {
			console.error(data);
			errorShowToast(data.error ?? 'Error');
			return;
		}
		return data;
	}, [errorShowToast]);

	const createSectionMessage = async (message: string, mediaContent: string[] = []) => {
		insertMessage(message, mediaContent, 'user', 'preview-created-user');
		insertMessage(NewChatMessageEnum.NEW_MESSAGE, [], 'assistant', 'preview-created-assistant');
		setIsSending(true);
		setIsNewSection(false);
		const response = await fetch(APIs.chatbot.createSection, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				message,
				contentMedia: mediaContent,
				user_id: user?.id,
			}),
		});
		const data = await response.json() as CreateNewSectionResponse & { error?: string };
		if (response.status !== 200) {
			console.error(data);
			errorShowToast(data.error ?? 'Error');
			return;
		}
		const newChatId = data._id.toString();
		setIsSending(false);
		// pre-fetch the new chat page
		router.prefetch(`/app/chatbot?id=${newChatId}`);
		// redirect to the new chat page
		router.push(`/app/chatbot?id=${newChatId}`);
		// insert new message to the chat
		insertMessage(data.message_generated, [], 'assistant', newChatId);
		setNewMessageId(newChatId);
		// update new section to the list
		setSections((prevSections) => [{
			_id: data._id as unknown as ObjectId,
			section_name: data.section_name,
			user_id: user?.id as unknown as ObjectId,
			createdAt: new Date(),
			updatedAt: new Date(),
			message_generated: [''] as unknown as ObjectId[],
		},
			...prevSections]);
	};

	const getChatHistory = useCallback(async (chat_id: string) => {
		if (!user?.id) {
			console.error('User id not found');
			return;
		}
		const response = await fetch('/api/v1/feature/chatbot/get-chat-history?user_id=' + user.id.toString() + '&section_id=' + chat_id);
		const responseData = await response.json() as { data: MessageHistoryType[]; error?: string };
		if (response.status !== 200) {
			console.error(responseData.error);
			errorShowToast(responseData.error ?? 'Error');
			return;
		}
		store.dispatch(loadChat({
			messages: responseData.data.map(message => ({
				id: String(message?._id ?? ''),
				role: message.role,
				message: message.message,
				contentMedia: message.mediaMessage ?? [],
			})),
		}));
	}, [errorShowToast, user]);

	const updateChatHistory = async (chat_id: string, update_data: UpdateSectionRequest['update_data']) => {
		const response = await fetch(APIs.chatbot.updateSection, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				update_data,
				section_id: chat_id,
			}),
		});
		const responseData = (await response.json()) as UpdateSectionResponse;
		if (response.status !== 200) {
			console.error(responseData.error);
			errorShowToast(responseData.error ?? 'Error');
			return;
		}
		return responseData.data;
	};

	useLayoutEffect(() => {
		setUser(userSession);
	}, [userSession]);

	useLayoutEffect(() => {
		if (params) {
			// console.log(params.get('id'));
			setChatId(params.get('id') ?? '');
		}
	}, [params]);

	useLayoutEffect(() => {
		if (userSession) {
			if (chat_id) {
				clearMessages();
				setIsNewSection(false);
				void (async () => {
					setIsLoadMessage(true);
					await getChatHistory(chat_id).then(() => {
						setIsLoadMessage(false);
					});
				})();
			} else {
				setIsNewSection(true);
				clearMessages();
			}
		}
	}, [chat_id, getChatHistory, userSession]);

	useLayoutEffect(() => {
		if (userSession) {
			void (async () => {
				const data = await getSections(String(userSession.id));
				if (data) {
					setSections(data.data);
				}
			})();
		}
	}, [getSections, userSession]);

	return (
		<ChatbotContext.Provider
			value={{
				isLoadMessage,
				contentMedia,
				setContentMedia,
				// @ts-ignore
				updateChatHistory,
				newMessageId,
				promptText,
				setPromptText,
				sections,
				messages,
				isNewSection,
				isSending,
				sendMessage,
				clearMessages,
				insertMessage,
				createSectionMessage,
			}}>
			{children}
		</ChatbotContext.Provider>
	);
};

const useChatbot = () => {
	const context = useContext(ChatbotContext);
	if (!context) {
		throw new Error('useChatbot must be used within a ChatbotProvider');
	}
	return context;
};

export const runtime = 'edge';

export { ChatbotProvider, useChatbot };