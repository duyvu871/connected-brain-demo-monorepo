'use client';
import React, { useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import type { ButtonProps } from '@nextui-org/react';
import { Button } from '@nextui-org/react';
import { MdContentCopy } from 'react-icons/md';
import { cn } from '@repo/utils';

type CopyValue = string | null;

interface CopyToClipBoardProps {
	childrenProps?: ButtonProps;
	children?: React.ReactNode;
	text: string;
	tooltipText?: string;
}

function Copy({ childrenProps, children, text, tooltipText }: CopyToClipBoardProps): JSX.Element {
	const [textToCopy, setTextToCopy] = useState<CopyValue>(text);
	const [isCopied, setIsCopied] = useState<boolean>(false);
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const onCopyText = () => {
		setIsCopied(true);
		setIsOpen(true);
		setTimeout(() => {
			setIsCopied(false);
			setIsOpen(false);
		}, 2000); // Reset status after 2 seconds
	};

	useEffect(() => {
		if (text) {
			setTextToCopy(text);
		}
	}, [text]);

	return (
		<div className="relative">
			<div
				className={cn(
					'absolute px-2 py-1 bg-zinc-800 text-zinc-300 border border-zinc-700 shadow rounded-xl text-md font-semibold top-[-36px] transition-all',
					isOpen ? '' : 'hidden',
				)}>
				{tooltipText ? tooltipText : 'Copied!'}
			</div>
			<CopyToClipboard
				onCopy={() => {
					setIsCopied(true);
					setIsOpen(true);
				}}
				text={textToCopy || ''}
			>
				{/*<input ref={inputRef} value={text}/>*/}
				<Button
					className="px-1 py-1 text-medium font-medium bg-transparent text-zinc-100 h-10 w-10 min-w-[10px]"
					disabled={isCopied}
					onClick={onCopyText}
					{...childrenProps}>
					{children ?? <MdContentCopy size={16}/>}
				</Button>
				{/*</Tooltip>*/}
			</CopyToClipboard>
		</div>
	);
}

export default Copy;
