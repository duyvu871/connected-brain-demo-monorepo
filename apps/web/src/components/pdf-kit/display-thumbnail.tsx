import * as React from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { thumbnailPlugin } from '@react-pdf-viewer/thumbnail';

import '@react-pdf-viewer/core/lib/styles/index.css';

import { pageThumbnailPlugin } from './plugins/page-thumbnail.tsx';


interface DisplayThumbnailExampleProps {
	fileUrl: string;
	pageIndex: number;
}

const DisplayThumbnail: React.FC<DisplayThumbnailExampleProps> = ({ fileUrl, pageIndex }) => {
	const thumbnailPluginInstance = thumbnailPlugin();
	const { Cover } = thumbnailPluginInstance;
	const pageThumbnailPluginInstance = pageThumbnailPlugin({
		PageThumbnail: <Cover getPageIndex={() => pageIndex} />,
	});

	return <Viewer fileUrl={fileUrl} plugins={[pageThumbnailPluginInstance, thumbnailPluginInstance]} />
};

export default DisplayThumbnail;