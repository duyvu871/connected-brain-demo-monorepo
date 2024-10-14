import { Card, CardContent } from '@ui/shadcn-ui/ui/card';
import { Box } from '@mantine/core';
import type { Selection} from '@nextui-org/react';
import { Chip, Select, SelectItem } from '@nextui-org/react';
import type { FC} from 'react';
import React from 'react';
import { useAtom } from 'jotai';

import SelectZone from '@/containers/Apps/OCRScan/components/starter/select-zone';
import DocPreUpload from '@/containers/Apps/OCRScan/components/starter/doc-pre-upload';
import UploadForward from '@/containers/Apps/OCRScan/components/starter/upload-forward';
import ExtractResult from '@/containers/Apps/OCRScan/components/starter/extract-result';
import { selectedOcrLang, selectedSourceLang } from '@/containers/Apps/OCRScan/states/starter';

const languages = [
	{ key: 'en', textValue: 'English' },
	{ key: 'vi', textValue: 'Vietnamese' },
	{ key: 'ja', textValue: 'Japanese' },
	{ key: 'ko', textValue: 'Korean' },
	{ key: 'zh', textValue: 'Chinese' },
];

export interface LanguageSelectProps {
	label: string;
	defaultSelectedKeys?: string[];
	languages: { key: string; textValue: string }[];
	selectedKeys: Selection;
	onSelectionChange: (selectedKeys: Selection) => void;
}

export const LanguageSelect: FC<LanguageSelectProps> = (props) => {
	return (
		<Select
			className="max-w-md w-full"
			classNames={{
				base: 'flex items-center',
				popoverContent: 'bg-zinc-50 dark:bg-zinc-950/80 backdrop-blur',
				innerWrapper: 'py-1.5',
				mainWrapper: 'w-[150px]',
				// label: 'whitespace-nowrap text-white',
				label: ' whitespace-nowrap text-sm text-zinc-900',
				selectorIcon: 'relative',
			}}
			defaultSelectedKeys={props.defaultSelectedKeys}
			label={props.label}
			labelPlacement="outside-left"
			onSelectionChange={props.onSelectionChange}
			radius="lg"
			renderValue={(items) => {
				// console.log('items', items);
				return (
					<div className="flex flex-wrap gap-1">
						{items.map((item) => (
							<Chip className="h-6 dark:text-zinc-100 text-zinc-700 " key={`chip-lang-${item.key}`}>
								{item.textValue}
							</Chip>
						))}
					</div>
				);
			}}
			selectedKeys={props.selectedKeys}
			size="sm"
		>
			{props.languages.map((lang) => (
				<SelectItem className="text-zinc-700 dark:text-white" key={lang.key}>
					{lang.textValue}
				</SelectItem>
			))}
		</Select>
	);
};

export default function UploadCard(): JSX.Element {
	const [sourceLang, setSelectedSourceLang] = useAtom(selectedSourceLang);
	const [OCRLang, setSelectedOcrLang] = useAtom(selectedOcrLang);

	return (
		<Card className="bg-zinc-50 select-none py-5 rounded-2xl mx-5">
			<CardContent className="flex flex-col gap-4 pb-0">
				<Box className="flex flex-col sm:flex-row justify-center items-start gap-5">
					<Box className="flex flex-col gap-4">
						<Box className="flex gap-1 justify-center items-center">
							<LanguageSelect
								defaultSelectedKeys={['en']}
								label="Source language"
								languages={languages}
								onSelectionChange={(selectKey) => setSelectedSourceLang(selectKey)}
								selectedKeys={sourceLang} />
						</Box>
					</Box>
					<Box className="flex flex-col gap-2">
						<Box className="flex gap-1 justify-center items-center">
							<LanguageSelect
								defaultSelectedKeys={['vi']}
								label="OCR result"
								languages={languages}
								onSelectionChange={(selectKey) => setSelectedOcrLang(selectKey)}
								selectedKeys={OCRLang} />
						</Box>
					</Box>
				</Box>
				<Box>
					<DocPreUpload />
				</Box>
				<Box className="w-full flex justify-between items-center gap-5">
					<Box>
						<SelectZone />
					</Box>
					<Box>
						<UploadForward />
						{/*<ExtractResult>*/}
						{/*	<div />*/}
						{/*</ExtractResult>*/}
					</Box>
				</Box>
			</CardContent>
		</Card>
	);
}