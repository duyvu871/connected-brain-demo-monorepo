
import type { ReactNode } from 'react';
import { forwardRef } from 'react';
import {
	AlertDialog, AlertDialogAction, AlertDialogCancel,
	AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
	AlertDialogHeader, AlertDialogTitle,
	AlertDialogTrigger,
} from '@ui/shadcn-ui/ui/alert-dialog.tsx';
import { Button } from '@ui/shadcn-ui/ui/button.tsx';
import { useAtom } from 'jotai/index';
import { theme as storageTheme } from '@/states/global/theme.ts';
import { cn } from '@repo/utils';
import * as React from 'react';
import type * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';

type ConfirmDialogProps = {
	title: string;
	description?: string;
	cancelLabel?: string;
	confirmLabel?: string;
	onConfirm?: () => void;
	onCancel?: () => void;
	children?: ReactNode;
}

const ConfirmDialog = forwardRef<
	React.ElementRef<typeof AlertDialogPrimitive.Root>, ConfirmDialogProps
>(
	({title, description, confirmLabel, cancelLabel, onConfirm, onCancel, children}, ref ) => {
	const [theme] = useAtom(storageTheme);

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				{children || <Button variant="outline">Show Dialog</Button>}
			</AlertDialogTrigger>
			<AlertDialogContent className={cn(theme, 'border-zinc-700 bg-zinc-950 w-fit min-w-[80vw] sm:min-w-[400px]')} ref={ref}>
				<AlertDialogHeader>
					<AlertDialogTitle className="dark:text-zinc-100">{title}</AlertDialogTitle>
					<AlertDialogDescription className="dark:text-zinc-100">{description}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel
						className="border-zinc-700 bg-zinc-950"
						{...(onCancel ? {onClick: onCancel} : {})}
					>{confirmLabel || 'Cancel'}</AlertDialogCancel>
					<AlertDialogAction
						className="dark:bg-zinc-100 dark:text-zinc-900"
						{...(onConfirm ? {onClick: onConfirm} : {})}
					>{confirmLabel || 'Continue'}</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
});
ConfirmDialog.displayName = 'ConfirmDialog';

export default ConfirmDialog