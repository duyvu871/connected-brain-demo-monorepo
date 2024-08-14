import React from 'react';
import type { ButtonProps } from '@nextui-org/react';
import { Button } from '@nextui-org/react';

interface DownloadFileAsContentProps {
	content: string | Buffer | ArrayBuffer | DataView;
	ext: string;
	fileName?: string;
	children?: React.ReactNode;
	childrenProps?: ButtonProps;
};

function DownloadFileAsContent({content, ext, fileName, children, childrenProps}: DownloadFileAsContentProps) {
	const downloadFile = () => {
		const blob = new Blob([content], {type: 'text/plain'});
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		console.log("DownloadFileAsContent -> link", link);
		link.href = url;
		link.download = `${fileName ?? "file"}.${ext}`;
		link.click();
	}

	return (
		<Button
			disabled={!content}
			onClick={downloadFile}
			{...childrenProps}>
			{children ?? "Download"}
		</Button>
	);

}

export default DownloadFileAsContent;