import * as React from 'react';
import type { Selection } from '@nextui-org/react';
import { Popover, PopoverContent, PopoverTrigger, Select, SelectItem } from '@nextui-org/react';
import { languageByValue, languages } from '@/lib/constants.ts';
import useUID from '@/hooks/useUID';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '@ui/shadcn-ui/ui/button.tsx';
import { CgArrowsExchange } from 'react-icons/cg';
import { ScrollArea } from '@ui/shadcn-ui/ui/scroll-area';
import axios from '@/libs/axios/v1/axios.ts';

type Props = {
	onCompletion: (text: string) => void;
	onError: (error: any) => void;
	apiMarked: (option: {
		text: string;
		from: string;
		to: string;
	}) => void;
	text: string;
	children: React.ReactNode;
};

const TranslatePopoverContent = (props: ExcludeProperties<Props, 'children'>) => {
	const [translatedText, setTranslatedText] = useState<string>(props.text);
	const [sourceLang, setSourceLang] = useState<Selection>(new Set(['en']));
	const [targetLang, setTargetLang] = useState<Selection>(new Set(['vi']));
	const isMounted = React.useRef(false);

	const getCompletion = async (text: string) => {
		if (!text.trim().length) {
			setTranslatedText("");
			return;
		}

		try {
			const fromLanguage = Array.from(sourceLang)[0];
			const toLanguage = Array.from(targetLang)[0];
			console.log(fromLanguage, toLanguage);
			const response = await axios.v1.translate({
				text,
				from: fromLanguage.toString(),
				to: toLanguage.toString(),
			});
			if (response) {
				setTranslatedText(response);
				props.onCompletion(response);
			}
		} catch (error) {
			console.error(error);
			props.onError(error);
		}
	}

	const handleSwitchLanguage = () => {
		const temp = sourceLang;
		setSourceLang(targetLang);
		setTargetLang(temp);
	}

	useEffect(() => {
		if (!isMounted.current) {
			isMounted.current = true;
			return;
		}
		(async () => {
			await getCompletion(props.text);
		})();

	}, [props.text, sourceLang, targetLang]);
	return (
		<>
			<div className="flex gap-2 items-center">
				<div className="flex flex-col justify-center items-start">
					{/*<span className="text-sm text-zinc-800 dark:text-zinc-300">From</span>*/}
					<Select
						className="max-w-xs min-w-[150px]"
						classNames={{
							trigger: 'rounded-md bg-zinc-100 dark:bg-zinc-900'
						}}
						label="From"
						onSelectionChange={setSourceLang}
						selectedKeys={sourceLang}
						size="sm"
					>
						{languages.map((language) => (
							<SelectItem key={language.query}>
								{language.value}
							</SelectItem>
						))}
					</Select>
				</div>
				<Button className="hover:opacity-75 transition-all w-10 p-0" onClick={handleSwitchLanguage} size="sm"
								variant="ghost">
					<CgArrowsExchange className="text-white text-2xl" />
				</Button>
				<div className="flex flex-col justify-center items-start">
					{/*<span className="text-sm text-zinc-800 dark:text-zinc-300">to</span>*/}
					<Select
						className="max-w-xs min-w-[150px]"
						classNames={{
							trigger: 'rounded-md bg-zinc-100 dark:bg-zinc-900'
						}}
						label="To"
						onSelectionChange={setTargetLang}
						selectedKeys={targetLang}
						size="sm"
					>
						{languages.map((language) => (
							<SelectItem key={language.query}>
								{language.value}
							</SelectItem>
						))}
					</Select>
				</div>
			</div>
			<ScrollArea className="max-h-72 min-h-20 p-3 w-full rounded-md bg-zinc-900">
				{translatedText || 'No text'}
			</ScrollArea>
		</>
	)
}

export const TranslatePopover = (props: Props) => {
	const [genUID] = useUID();
	const [isOpen, setIsOpen] = useState(false);
	return (
		<Popover
			backdrop="opaque"
			isOpen={isOpen}
			onOpenChange={(open) => setIsOpen(open)}
			placement="top"
			showArrow
		>
			<PopoverTrigger>
				{props.children}
			</PopoverTrigger>
			<PopoverContent className="max-w-[364px] p-1 rounded-md flex flex-col">
				<TranslatePopoverContent {...props} />
			</PopoverContent>
		</Popover>
	);
};