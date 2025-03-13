'use client';
import React, { useCallback } from 'react';
import { useChatbot } from './ChatbotContext';
import { cn } from '@repo/utils';

interface ContentMediaItemProps {
    media: string;
    index: number;
    removeItemAction: (index: number) => void;
}

const ContentMediaItem: React.FC<ContentMediaItemProps> = ({
    media,
    index,
    removeItemAction,
}) => {
    return (
        <div className="relative w-24 h-28">
            <div className="w-full h-full relative rounded-xl flex justify-center items-center bg-zinc-800 overflow-hidden">
                <img 
                    src={media} 
                    alt="media content" 
                    className="w-full h-full object-cover rounded-lg"
                />
            </div>
            <button
                className="w-5 h-5 rounded-full flex justify-center items-center bg-zinc-600 hover:bg-zinc-500 hover:text-white transition-all absolute top-0 right-0 z-[100] translate-x-[30%] translate-y-[-30%]"
                onClick={() => removeItemAction(index)}
                type="button"
            >
                ×
            </button>
        </div>
    );
};

const ContentMedia: React.FC = () => {
    const { contentMedia, setContentMedia } = useChatbot();

    const deleteItem = useCallback((indexToDelete: number) => {
        setContentMedia(prevContent => prevContent.filter((_, index) => index !== indexToDelete));
    }, [setContentMedia]);

    if (contentMedia.length === 0) return null;

    return (
        <div className="flex p-2 m-2 gap-4 justify-start w-full">
            {contentMedia.map((media, index) => (
                <ContentMediaItem
                    key={`media-content-${index}`}
                    index={index}
                    media={media}
                    removeItemAction={deleteItem}
                />
            ))}
        </div>
    );
};

export default ContentMedia;