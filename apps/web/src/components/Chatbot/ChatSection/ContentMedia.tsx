import { useChatbot } from '@/providers/ChatbotContext';
import useUID from '@/hooks/useUID';
import React, { memo, useCallback } from 'react';
import { Image } from '@nextui-org/react';
import { LiaTimesSolid } from 'react-icons/lia';

const ContentMediaItem = memo(
	({
		media,
		index,
		removeItemAction,
	}: {
		media: string;
		index: number;
		removeItemAction: (index: number) => void;
	}) => {
		return (
			<div className="relative w-24 h-28">
				<div
					className="w-full h-full relative rounded-xl flex justify-center items-center bg-zinc-800 overflow-hidden">
					<Image alt="media" className="w-full h-full object-cover" radius="lg" src={media} />
				</div>
				<button
					className="w-5 h-5 rounded-full flex justify-center items-center bg-zinc-600 hover:bg-zinc-500 hover:text-white transition-all absolute top-0 right-0 z-[100] translate-x-[30%] translate-y-[-30%]"
					onClick={() => {
						removeItemAction(index);
					}}
					type="button">
					<LiaTimesSolid />
				</button>
			</div>
		);
	},
);
ContentMediaItem.displayName = 'ContentMediaItem';

function ContentMediaList() {
	const { contentMedia, setContentMedia } = useChatbot();
	const [generateUID] = useUID();
	const deleteItem = useCallback((indexToDelete: number) => {
		setContentMedia(prevContent => prevContent.filter((item, index) => index !== indexToDelete));
	}, [setContentMedia]);
	if (contentMedia.length === 0) return null;
	return (
		<div className="flex p-2 m-2 gap-4 justify-start w-full">
			{contentMedia.map((media, index) => (
				<ContentMediaItem
					index={index}
					key={'media-content_' + generateUID()}
					media={media}
					removeItemAction={deleteItem}
				/>
			))}
		</div>
	);
}

export default memo(ContentMediaList);
