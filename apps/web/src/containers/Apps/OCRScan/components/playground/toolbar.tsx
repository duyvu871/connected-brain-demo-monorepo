import React from 'react';
import { Label } from '@ui/shadcn-ui/ui/label.tsx';
import { languageByQueryLanguage, languageByValue, languages } from '@/lib/constants.ts';
import ComboboxLanguage from '@ui/shadcn-ui/ui/combobox-language.tsx';
import { useAtom } from 'jotai';
import { selectedOcrLang, selectedSourceLang } from '@/containers/Apps/OCRScan/states/starter.ts';
import SelectZone from '@/containers/Apps/OCRScan/components/starter/select-zone.tsx';
import { CloudUploadIcon} from 'lucide-react';
import DocPreUpload from '@/containers/Apps/OCRScan/components/starter/doc-pre-upload.tsx';
import UploadButton from '@/containers/Apps/OCRScan/components/playground/upload-button.tsx';

function Toolbar() {
	const [sourceLang, setSelectedSourceLang] = useAtom(selectedSourceLang);
	const [OCRLang, setSelectedOcrLang] = useAtom(selectedOcrLang);

	return (
		<form className="grid w-full items-start gap-5 max-w-[400px]">
			<fieldset className="grid gap-6 rounded-lg border border-zinc-300 dark:border-zinc-800 p-4">
				<legend className="-ml-1 px-1 text-sm font-medium text-zinc-700 dark:text-zinc-100">
					Settings
				</legend>
				<div className="grid gap-3">
					<Label className="dark:text-zinc-100 text-zinc-700" htmlFor="source-lang">Source</Label>
					<ComboboxLanguage
						onChange={(fromLanguage: string) => {
							setSelectedSourceLang(new Set([languageByValue[fromLanguage].query]));
						}}
						options={languages}
						value={languageByQueryLanguage[Array.from(sourceLang)[0]].value}
					/>
				</div>
				<div className="grid gap-3">
					<Label className="dark:text-zinc-100 text-zinc-700" htmlFor="target-lang">Target</Label>
					<ComboboxLanguage
						onChange={(targetLang: string) => {
							// console.log(languageByValue[targetLang].query);
							setSelectedOcrLang(new Set([languageByValue[targetLang].query]));
						}}
						options={languages}
						value={languageByQueryLanguage[Array.from(OCRLang)[0]].value}
					/>
				</div>
				<div className="grid gap-3">
					<div className="flex flex-col items-center justify-center w-full max-w-2xl gap-6 mx-auto">
						<SelectZone>
							<div
								className="relative p-2 w-full h-32 p-6 border-2 border-dashed rounded-lg border-zinc-300 dark:border-zinc-800 transition-colors">
								<div
									className="absolute inset-0 flex items-center justify-center text-center text-muted-foreground cursor-pointer">
									<div className="text-md">
										<CloudUploadIcon className="w-8 h-8 mx-auto" />
										<p className="text-sm">Drag and drop files here</p>
										<p className="text-xs">or</p>
										<p className="text-sm">Select file</p>
									</div>
								</div>
							</div>
						</SelectZone>
						{/*<input className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" multiple type="file" />*/}
					</div>
					<div className="w-full">
							<div className="divide-y divide-muted">
								<DocPreUpload classNames={{
									fileInfo: 'text-zinc-100 clamp-1 max-w-[150px] overflow-hidden',
								}}/>
							</div>
					</div>
					</div>
				<div className="grid gap-3">
					<UploadButton loading />
				</div>
			</fieldset>
		</form>
	);
}

export default Toolbar;