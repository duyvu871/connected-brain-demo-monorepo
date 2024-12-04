// @flow
import * as React from 'react';
import { transcript as transcriptAtom } from '@/containers/Apps/SpeechToText/states/transcript.ts';
import { useAtom } from 'jotai';
import useUID from '@/hooks/useUID';
import { Select, type Selection, SelectItem } from '@nextui-org/react';
import { languages } from '@/lib/constants.ts';
import { Button } from '@ui/shadcn-ui/ui/button.tsx';
import { Textarea } from '@ui/shadcn-ui/ui/textarea.tsx';
import { CgArrowsExchange } from 'react-icons/cg';
import { useEffect, useState } from 'react';
import axios from '@/libs/axios/v1/axios.ts';
import { ScrollArea } from '@ui/shadcn-ui/ui/scroll-area';

export const TranscriptTranslate = () => {
	const [transcript] = useAtom(transcriptAtom);
	const [translatedText, setTranslatedText] = useState<string>("");
	const [rawText, setRawText] = useState<string>("");
	const [sourceLang, setSourceLang] = useState<Selection>(new Set(['en']));
	const [targetLang, setTargetLang] = useState<Selection>(new Set(['vi']));
	const isMounted = React.useRef(false);

	const [genUID] = useUID();

	const handleSwitchLanguage = () => {
		const temp = sourceLang;
		setSourceLang(targetLang);
		setTargetLang(temp);
	}

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
				console.log(response);
				setTranslatedText(response);
			}
		} catch (error) {
			console.error(error);
		}
	}

	useEffect(() => {
		if (!isMounted.current) {
			isMounted.current = true;
			return;
		}
		const transcriptText = transcript?.transcript.map((sentence, index) => {
			return (
				sentence.words.map((word, index) => {
					return (word.text);
				}).join(' ')
			);
		}).join(' ');
		(async () => {
			if (!transcriptText) {
				return;
			}
			setRawText(transcriptText);
			await getCompletion(transcriptText);
		})();

	}, [transcript, sourceLang, targetLang]);

	return (
		<>
			<div className="flex gap-2 items-center mb-3">
				<div className="w-full flex flex-col justify-center items-start">
					<Select
						className="max-w-xs w-full"
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
				<Button className="hover:opacity-75 transition-all w-8 xl:w-10 p-0" onClick={handleSwitchLanguage} size="sm"
								variant="ghost">
					<CgArrowsExchange className="text-white text-2xl" />
				</Button>
				<div className="w-full flex flex-col justify-center items-start">
					{/*<span className="text-sm text-zinc-800 dark:text-zinc-300">to</span>*/}
					<Select
						className="max-w-xs w-full"
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

			<div className="flex flex-col gap-4 h-full">
				<Textarea
					className="cursor-text disabled:opacity-100 border-0 dark:text-zinc-100 text-zinc-700 max-h-24 lg:max-h-72 !h-full p-3 w-full resize-none overflow-auto"
					disabled
					value={rawText} />
				<Textarea
					className="cursor-text disabled:opacity-100 border-0 dark:text-zinc-100 text-zinc-70 max-h-24 lg:max-h-72 !h-full p-3 w-full resize-none overflow-auto"
					disabled
					value={translatedText} />
			</div>
		</>
	);
};