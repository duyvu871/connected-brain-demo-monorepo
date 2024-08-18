import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@ui/shadcn-ui/ui/popover';
import { cn } from '@repo/utils';
import { LiaTimesSolid } from 'react-icons/lia';

interface ModalWrapperProps {
	trigger: React.ReactNode;
	content: React.ReactNode;
	containCloseBtn?: boolean;
}

function ModalWrapper({ trigger, content, containCloseBtn }: ModalWrapperProps) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Popover onOpenChange={open => setIsOpen(open)} open={isOpen}>
			<PopoverTrigger>{trigger}</PopoverTrigger>
			<PopoverContent className={cn('shadow-2xl rounded-xl bg-zinc-800 z')}>
				{containCloseBtn ? <div className="w-full flex justify-end items-end p-2">
						<div className="cursor-pointer" onClick={() => setIsOpen(false)}>
							<LiaTimesSolid />
						</div>
					</div> : null}
				<div className="">{content}</div>
			</PopoverContent>
		</Popover>
	);
}

export default ModalWrapper;
