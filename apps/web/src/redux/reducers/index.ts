import { combineReducers } from 'redux';
import chatReducer, { inputReducer } from '@/redux/reducers/ChatbotReducer';
import { modalReducer } from '@/redux/reducers/modalReducer';

const rootReducer = combineReducers({
	chat: chatReducer,
	modal: modalReducer,
	inputMessage: inputReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;