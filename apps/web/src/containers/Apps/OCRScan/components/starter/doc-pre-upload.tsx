import { useAtom } from 'jotai';
import { starterAssetsPreUpload } from '@/containers/Apps/OCRScan/states/starter';
import { useEffect, useState } from 'react';
import { file as fileUtils } from '@repo/utils';
import { Box } from '@mantine/core';
import { CiFileOn } from 'react-icons/ci';
import { IoCloseSharp } from 'react-icons/io5';

export default function DocPreUpload(): JSX.Element {
	const [file, setFile] = useAtom(starterAssetsPreUpload);
	const [fileSize, setFileSize] = useState<string>('');

	useEffect(() => {
		if (file) {
			const calcFileSize = fileUtils.calculateFileSize(file.size);
			setFileSize(calcFileSize);
		}
	}, [file]);

	return (
		<>
			{Boolean(file) && (
				<Box className="flex items-center justify-between border border-zinc-700 rounded-lg p-2">
					<Box className="flex items-center gap-2">
						<CiFileOn className="text-zinc-700" size={30} />
						<Box>
							<p
								className="text-sm text-zinc-700 font-medium max-w-24 sm:max-w-52 md:max-w-72 whitespace-break-spaces">
								{file?.name}
							</p>
							<p className="text-xs text-zinc-500">{fileSize}</p>
						</Box>
					</Box>
					<button className="shrink-0 p-2 group-[close]" onClick={() => setFile(null)} type="button">
						<IoCloseSharp className="text-zinc-800" size={24} />
					</button>
				</Box>
			)}
		</>
	);
}