import type { PrimitiveAtom } from 'jotai/vanilla/atom';
import { useAtom } from 'jotai';
import type { MessageListItem } from '@/states/speech-to-text/playground.ts';
import { messageListAtom } from '@/states/speech-to-text/playground.ts';


export const useMessage = () => {
	const [messageList, setMessageList] = useAtom(messageListAtom);
	
	const addMessage = (message: MessageListItem) => {
		setMessageList([...messageList, message]);
	};

	
}