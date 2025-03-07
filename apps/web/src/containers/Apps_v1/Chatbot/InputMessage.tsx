import { useChatbot } from './ChatbotContext';
import React, { useCallback, useState } from 'react';
import { cn } from '@repo/utils';
import AutoResizeQuill from '@/components/Chatbot/Textarea';
import Tooltip from '@/components/Tooltip';
import UploadModal from '@/components/Chatbot/Modals/UploadModal';
import { MdOutlineFileUpload } from 'react-icons/md';
import { BsFillSendFill } from 'react-icons/bs';
import { IoMicSharp, IoSend } from 'react-icons/io5';
import VoiceRecordModal from '@/components/Chatbot/Modals/VoiceRecordModal';
import store from '@/redux/store';
import { useToast } from '@/hooks/useToast';
import { AiOutlinePaperClip } from 'react-icons/ai';
import UploadWrapped from '@/components/Upload/upload-wrapped.tsx';

export default function InputMessage() {
    const { contentMedia, setContentMedia, sendMessage, setMediaFiles, uploadPDFContext } = useChatbot();
    const [promptText, setPromptText] = useState<string>('');
    const [isTooLong, setIsTooLong] = useState<boolean>(false);
    const [isSendMessage, setIsSendMessage] = useState<boolean>(false);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const { error } = useToast();

    const updateInputValue = (value: string) => {
        store.dispatch({ type: 'UPDATE_INPUT', payload: value });
    };

    const handleSendMessage = useCallback(async () => {
        try {
            if (promptText === '') return;
            await sendMessage(promptText, contentMedia);
            setContentMedia([]);
            setPromptText('');
            updateInputValue('');
            setIsSendMessage(true);
            setTimeout(() => {
                setIsSendMessage(false);
            }, 1000);
        } catch (e: any) {
            error(e.message);
        }
    }, [promptText, sendMessage, contentMedia, setContentMedia, updateInputValue]);

    const handleSelectFiles = useCallback((files: File[] | File) => {
        // setMediaFiles([...(Array.isArray(files) ? files : [files])]);
        uploadPDFContext([...(Array.isArray(files) ? files : [files])])
    }, [setMediaFiles,uploadPDFContext]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        const pdfFiles = files.filter(file => file.type === 'application/pdf');
        
        if (pdfFiles.length > 0) {
            handleSelectFiles(pdfFiles);
        } else {
            error('Only PDF files are allowed');
        }
    }, [handleSelectFiles, error]);

    return (
        <div 
            className={cn(
                'flex flex-col md:flex-row justify-between items-center md:items-end p-2 gap-2 rounded-3xl dark:bg-zinc-900 relative', 
                isTooLong ? 'flex-col' : '',
                isDragging ? 'border-2 border-dashed border-zinc-500' : ''
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <AutoResizeQuill
                className={cn(
                    'w-full outline-none max-h-52 resize-none text-white p-2 bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800',
                    isTooLong ? 'h-fit p-2' : 'h-14',
                )}
                event={{
                    onEnter: () => {
                        if (promptText === '') return;
                        void (sendMessage(promptText, contentMedia));
                        setContentMedia([]);
                    },
                }}
                isClear={isSendMessage}
                isDisabled={false}
                onContentChange={setPromptText}
                placeholder="Type a message"
                setIsTooLong={setIsTooLong}
                value={promptText}
            />
            <div
                className={cn('w-full md:w-fit flex flex-row justify-end items-center gap-2')}>
                {/* <Tooltip title="Voice Record">
                    <VoiceRecordModal>
                        <div className="p-2 aspect-square flex justify-center items-center rounded-full cursor-pointer">
                            <IoMicSharp className="dark:text-zinc-50 text-zinc-600" size={24} />
                        </div>
                    </VoiceRecordModal>
                </Tooltip> */}
                <Tooltip title="Upload PDF Files">
                    <UploadWrapped
                        multiSelect
                        accept={".pdf"}
                        onFileSelect={handleSelectFiles}
                    >
                        <div
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-300 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover-zinc-700 transition-colors cursor-pointer gap-3">
                            <AiOutlinePaperClip className="dark:text-zinc-50 text-zinc-700" size={19} />
                        </div>
                    </UploadWrapped>
                </Tooltip>
                <Tooltip title="Generate prompt">
                    <div
                        className="w-10 h-10 flex items-center justify-center rounded-full dark:bg-zinc-300 bg-zinc-800 dark:hover:bg-zinc-200 hover:bg-zinc-700 transition-colors cursor-pointer gap-3"
                        onClick={handleSendMessage}
                    >
                        <IoSend className="text-zinc-50 dark:text-zinc-800" />
                    </div>
                </Tooltip>
            </div>
        </div>
    );
}