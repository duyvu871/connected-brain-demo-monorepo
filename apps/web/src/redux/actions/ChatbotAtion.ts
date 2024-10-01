// Actions.ts
import type { ObjectId } from 'mongodb';
import type { MessageHistoryType } from 'types/apps/chatbot/api.type.ts';

export enum ChatActionTypes {
	UPDATE_CHAT = 'UPDATE_CHAT',
	INSERT_MESSAGE = 'INSERT_MESSAGE',
	DELETE_MESSAGE = 'DELETE_MESSAGE',
	LOAD_CHAT = 'LOAD_CHAT',
	UPDATE_CHAT_BY_ID = 'UPDATE_CHAT_BY_ID',
}

interface UpdateChatAction {
	type: ChatActionTypes.UPDATE_CHAT;
	payload: {
		messages: InsertMessageAction['payload']['messages']; // Update the message array
	};
}

interface UpdateChatByIdAction {
	type: ChatActionTypes.UPDATE_CHAT_BY_ID;
	payload: {
		reference_link?: MessageHistoryType['reference_link'];
		message: string; // Update the message array
		id: string;
	};
}

interface InsertMessageAction {
	type: ChatActionTypes.INSERT_MESSAGE;
	payload: {
		messages: {
			message: string;
			contentMedia: string[];
			role: 'user' | 'assistant';
			id: string;
		}[];
	};
}

interface DeleteMessageAction {
	type: ChatActionTypes.DELETE_MESSAGE;
	payload: {
		messageId: string; // Or any unique identifier for messages
	};
}

interface LoadChatAction {
	type: ChatActionTypes.LOAD_CHAT;
	payload: {
		messages: InsertMessageAction['payload']['messages']
	};
}

export type ChatAction =
	| UpdateChatAction
	| InsertMessageAction
	| DeleteMessageAction
	| LoadChatAction
	| UpdateChatByIdAction;

// Create action creators
export const updateChat = (newMessages: InsertMessageAction['payload']['messages']): UpdateChatAction => ({
	type: ChatActionTypes.UPDATE_CHAT,
	payload: { messages: newMessages },
});

export const updateChatById = (newMessage: string, ref_link: MessageHistoryType['reference_link'], id: string): UpdateChatByIdAction => ({
	type: ChatActionTypes.UPDATE_CHAT_BY_ID,
	payload: { message: newMessage, reference_link: ref_link, id },
});

export const insertMessage = (message: string, contentMedia: string[] = [''], role: 'user' | 'assistant', id: string): InsertMessageAction => ({
	type: ChatActionTypes.INSERT_MESSAGE,
	payload: {
		messages: [{ message, role, id, contentMedia }],
	},
});

export const deleteMessage = (messageId: string | ObjectId): DeleteMessageAction => ({
	type: ChatActionTypes.DELETE_MESSAGE,
	payload: { messageId: messageId.toString() },
});

export const loadChat = (payload: InsertMessageAction['payload']): LoadChatAction => ({
	type: ChatActionTypes.LOAD_CHAT,
	payload: { messages: payload.messages },
});


// history toggle action

export enum ModalActionTypes {
	HideModal = 'HIDE_MODAL',
	ShowModal = 'SHOW_MODAL',
	ToggleModal = 'TOGGLE_MODAL',
}

export interface ModalAction {
	type: ModalActionTypes;
	payload?: boolean;
	modal_name?: string;
}

export function showModal(name: string): ModalAction {
	return {
		type: ModalActionTypes.ShowModal,
		payload: true,
		modal_name: name,
	};
}

export function hideModal(name: string): ModalAction {
	return {
		type: ModalActionTypes.HideModal,
		payload: false,
		modal_name: name,
	};
}

export function toggleModal(name: string): ModalAction {
	return {
		type: ModalActionTypes.ToggleModal,
		modal_name: name,
	};
}
