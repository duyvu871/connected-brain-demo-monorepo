import { ChatActionTypes } from '@/redux/actions/ChatbotAtion';
import type { ChatAction } from '@/redux/actions/ChatbotAtion';

export interface ChatState {
	messages: {
		message: string;
		contentMedia: string[];
		role: 'user' | 'assistant';
		id: string;
	}[];
}

export const initialState: ChatState = {
	messages: [],
};

const chatReducer = (state = initialState, action: ChatAction): ChatState => {
	switch (action.type) {
		case ChatActionTypes.UPDATE_CHAT:
			return {
				...state,
				messages: [...action.payload.messages],
			};
		case ChatActionTypes.INSERT_MESSAGE:
			return {
				...state,
				messages: [...state.messages, ...action.payload.messages],
			};
		case ChatActionTypes.DELETE_MESSAGE:
			const newMessages = state.messages.filter((message, index) =>
				!(message.id === action.payload.messageId));
			console.log(newMessages);
			return { ...state, messages: newMessages };
		case ChatActionTypes.LOAD_CHAT:
			return {
				...state,
				messages: action.payload.messages,
			};
		case ChatActionTypes.UPDATE_CHAT_BY_ID:
			const updatedMessages = state.messages.map((message) => {
				if (message.id === action.payload.id) {
					return { ...message, message: action.payload.message };
				}
				return message;
			});
			return { ...state, messages: updatedMessages };
		default:
			return state;
	}
};

// Định nghĩa kiểu dữ liệu cho state
export interface InputState {
	inputValue: string;
}

// Định nghĩa action type
const UPDATE_INPUT = 'UPDATE_INPUT';

// Định nghĩa action creator
export interface UpdateInputAction {
	type: typeof UPDATE_INPUT;
	payload: string;
}

type InputActionTypes = UpdateInputAction;

// Khởi tạo state ban đầu
const initialInputState: InputState = {
	inputValue: '',
};

// Tạo reducer
export const inputReducer = (state = initialInputState, action: InputActionTypes): InputState => {
	switch (action.type) {
		case UPDATE_INPUT:
			return { ...state, inputValue: action.payload };
		default:
			return state;
	}
};

export default chatReducer;

