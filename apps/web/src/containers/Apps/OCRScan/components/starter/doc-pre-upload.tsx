import { useAtom } from 'jotai';
import { starterAssetsPreUpload } from '@/containers/Apps/OCRScan/states/starter';
import React, { cloneElement, forwardRef, ReactNode, useEffect, useState } from 'react';
import { cn, file as fileUtils } from '@repo/utils';
import { Box } from '@mantine/core';
import { CiFileOn } from 'react-icons/ci';
import { IoCloseSharp } from 'react-icons/io5';
import type { FileExtIcon } from '@/lib/fileExtIcon.ts';
import { fileExtIcon } from '@/lib/fileExtIcon.ts';

type DocPreUploadProps = {
	classNames?: {
		wrapper?: string;
		icon?: string;
		fileInfo?: string;
	};
}


export default function DocPreUpload(props: DocPreUploadProps): JSX.Element {
	const { classNames } = props;

	const [file, setFile] = useAtom(starterAssetsPreUpload);
	const [fileSize, setFileSize] = useState<string>('');
	const Icon = fileExtIcon[file?.name.split('.').pop() as FileExtIcon || 'default'] || CiFileOn;

	useEffect(() => {
		if (file) {
			const calcFileSize = fileUtils.calculateFileSize(file.size);
			setFileSize(calcFileSize);
		}
	}, [file]);

	return (
		<>
			{Boolean(file) && (
				<Box className={cn('flex items-center justify-between border border-zinc-700 rounded-lg p-2', classNames?.wrapper)}>
					<Box className="flex items-center gap-2">
						<Icon className="text-zinc-700" size={30} />
						<Box className={cn(classNames?.fileInfo)}>
							<p
								className="text-sm text-zinc-700 font-medium max-w-24 sm:max-w-52 md:max-w-72 whitespace-break-spaces">
								{file?.name}
							</p>
							<p className="text-xs text-zinc-500">{fileSize}</p>
						</Box>
					</Box>
					<button className={cn('shrink-0 p-2 group-[close]', classNames?.icon)} onClick={() => setFile(null)} type="button">
						<IoCloseSharp className="text-zinc-800" size={24} />
					</button>
				</Box>
			)}
		</>
	);
}