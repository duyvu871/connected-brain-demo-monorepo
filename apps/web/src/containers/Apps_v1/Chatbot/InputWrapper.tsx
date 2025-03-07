'use client';
import React from 'react';
import InputMessage from './InputMessage';
import PDFUploadBox from './PDFUploadBox';

interface InputWrapperProps {
    className?: string;
}

const InputWrapper: React.FC<InputWrapperProps> = ({ className }) => {
    return (
        <div
            className="w-full h-14 h-fit rounded-3xl hidden:border bg-zinc-100 dark:bg-zinc-900 relative z-[110]">
            <PDFUploadBox />
            <InputMessage />
        </div>
    );
};

export default InputWrapper;