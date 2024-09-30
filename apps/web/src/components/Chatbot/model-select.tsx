import React, { useEffect, useRef, useState } from 'react';
// import {Select, SelectTrigger, SelectValue, SelectGroup, SelectItem, SelectContent, SelectLabel} from '@ui/shadcn-ui/ui/select.tsx'
import { useAtom } from 'jotai';
import { availableModels, selectedModel } from '@/states/Chatbot/playground';
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { DialogPortal } from "@radix-ui/react-dialog";
import { Button } from '@ui/shadcn-ui/ui/button';
import { CaretSortIcon, CheckIcon, Cross2Icon } from '@radix-ui/react-icons';
import { Command, CommandGroup, CommandEmpty, CommandInput, CommandList, CommandItem } from '@ui/shadcn-ui/ui/command';
import { cn } from '@repo/utils';
import { Dialog, DialogDescription, DialogOverlay, DialogTitle, DialogTrigger } from '@ui/shadcn-ui/ui/dialog';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import axios from '@/libs/axios/v1/axios.ts';

function ModelSelect() {
	const [models, setModels] = useAtom(availableModels);
	const [value, setValue] = useAtom(selectedModel);
	const [open, setOpen] = useState(false);
	const isMounted = useRef(false);
	useEffect(() => {
		if (models.length === 0 && !isMounted.current) {
			(async () => {
				const availableModels = await axios.v1.chatbot.getAvailableModels();
				if (availableModels?.models) {
					setModels(availableModels.models);
					const defaultModel = availableModels.models.find((model) => model.default);
					setValue(defaultModel ? defaultModel.code : null);
				}
			})();
			isMounted.current = true;
		}
	}, []);

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogTrigger asChild>
				<Button
					aria-expanded={open}
					className="w-full max-w-xs justify-between dark:text-zinc-400 text-zinc-600 bg-zinc-100 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700"
					role="combobox"
					variant="outline"
				>
					{value
						? models.find((model) => model.code === value)?.name
						: "Select model..."}
					<CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</DialogTrigger>
			<DialogPortal>
				<DialogOverlay className="z-[240]" />
				<DialogPrimitive.Content
					className={cn(
						"fixed left-[50%] top-[50%] z-[250] grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
						"p-5 md:w-[320px] md:p-0 bg-opacity-0 border-0"
					)}
					
				>
					<VisuallyHidden.Root asChild>
						<DialogTitle>Choose a model</DialogTitle>
					</VisuallyHidden.Root>
					<VisuallyHidden.Root asChild>
							<DialogDescription>Choose a model</DialogDescription>
					</VisuallyHidden.Root>
					<Command className="bg-zinc-900 border-zinc-300 dark:border-zinc-700">
						<CommandInput className="h-9 border-zinc-300 dark:border-zinc-700" placeholder="Search model..." />
						<CommandList className="border-zinc-300 dark:border-zinc-700">
							<CommandEmpty>No models found.</CommandEmpty>
							<CommandGroup>
								{models.map((model) => (
									<CommandItem
										className={cn("flex items-center p-2 cursor-pointer", value === model.code && "bg-zinc-200 dark:bg-zinc-800 text-muted-foreground")}
										key={`model-${model.code}`}
										onSelect={(currentValue) => {
											setValue(model.code);
											setOpen(false)
										}}
										value={model.name}
									>
										{model.name}
										<CheckIcon
											className={cn(
												"ml-auto h-4 w-4",
												value === model.code ? "opacity-100" : "opacity-0"
											)}
										/>
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
					<DialogPrimitive.Close className="absolute right-7 top-7 sm:right-2 sm:top-2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
						<Cross2Icon className="h-4 w-4" />
						<span className="sr-only">Close</span>
					</DialogPrimitive.Close>
				</DialogPrimitive.Content>
			</DialogPortal>
		</Dialog>
	);
}

export default ModelSelect;