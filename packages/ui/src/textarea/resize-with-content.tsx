
import type { FormEvent} from 'react';
import React, { forwardRef, useCallback } from 'react';
import { cn } from '@repo/utils';

type ResizeWithContentProps = React.HTMLAttributes<HTMLTextAreaElement> & {
	autoresize?: boolean;
}

const ResizeWithContent = forwardRef<HTMLTextAreaElement, ResizeWithContentProps>((props, ref) => {
	const {className, onInput, ...textareaProps } = props;
	const autoResizeHandle = useCallback((event: FormEvent<HTMLTextAreaElement>) => {
		const element = event.currentTarget;
		onInput && onInput(event);
		if (textareaProps.autoresize) {
			element.style.height = 'auto';
			element.style.height = `${element.scrollHeight}px`;
		}
	}, [onInput, textareaProps.autoresize]);
	return (
		<textarea
			className={cn(
				"flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
				className ?? ""
			)}
			onInput={autoResizeHandle}
			ref={ref}
			{...textareaProps}
		/>
	);
});
ResizeWithContent.displayName = 'ResizeWithContent';
export default ResizeWithContent;