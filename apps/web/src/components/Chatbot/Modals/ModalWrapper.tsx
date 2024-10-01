import React, { useEffect, useState } from 'react';
import { Popover, PopoverTrigger, PopoverContent, Button } from '@nextui-org/react';
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
		<Popover isOpen={isOpen} onOpenChange={open => {
			setIsOpen(open)
		}}
		placement="top-start"
		>
			<PopoverTrigger as="button">
				<Button className="border-0 p-0 m-0" variant="ghost">
					{trigger}
				</Button>
			</PopoverTrigger>
			<PopoverContent className={cn('shadow-2xl rounded-xl bg-zinc-50 dark:bg-zinc-800 z-[400]')}>
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
