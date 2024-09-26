import store from '@/redux/store';
import { toggleModal } from '@/redux/actions/ChatbotAtion.ts';
import { SquarePen } from 'lucide-react';

export default function HistoryModelTrigger() {
	const handleToggleModal = () => {
		store.dispatch(toggleModal('history_modal') as any);
	};
	return (
		<button
			className='md:hidden flex items-center justify-center h-10 w-10 rounded-full hover:bg-zinc-200/40 dark:hover:bg-zinc-800/40 transition-all'
			onClick={() => handleToggleModal()}
			type='button'>
			<SquarePen className='text-zinc-700 dark:text-zinc-200' size={20} />
		</button>
	)
}