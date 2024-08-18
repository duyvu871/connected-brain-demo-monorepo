import type { ModalAction} from '@/redux/actions/ChatbotAtion';
import { ModalActionTypes } from '@/redux/actions/ChatbotAtion';

export type ModalState = Record<string, boolean>;

const initialModalState: ModalState = {
	history_modal: false,
};

export const modalReducer = (state = initialModalState, action: ModalAction): ModalState => {
	switch (action.type) {
		case ModalActionTypes.ShowModal:
			return {
				...state,
				[action.modal_name!]: true,
			};
		case ModalActionTypes.HideModal:
			return {
				...state,
				[action.modal_name!]: false,
			};
		case ModalActionTypes.ToggleModal:
			return {
				...state,
				[action.modal_name!]: !state[action.modal_name!],
			};
		default:
			return state;
	}
};