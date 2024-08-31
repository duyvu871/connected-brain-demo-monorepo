"use client";
import React from 'react';
import SelectZone from '@/containers/Apps/OCRScan/components/starter/select-zone.tsx';
import { CloudUploadIcon } from 'lucide-react';
import DocPreUpload from '@/containers/Apps/OCRScan/components/starter/doc-pre-upload.tsx';
import UploadForward from '@/containers/Apps/OCRScan/components/starter/upload-forward.tsx';
import UploadProgress from '@/containers/Apps/OCRScan/components/upload-progress.tsx';
import UploadButton from '@/containers/Apps/OCRScan/components/playground/upload-button.tsx';

function UploadScreen() {
	return (
		<div className="w-full min-h-[calc(100vh_-_57px)] lg:h-[calc(100vh_-_57px)] relative flex">
			<div className="p-5 w-full flex flex-col justify-center items-center gap-5">
				<div className="max-w-md w-full">
					<SelectZone>
						<div
							className="relative p-2 w-full h-fit p-6 border-2 border-dashed rounded-lg border-zinc-700 hover:border-primary-foreground transition-colors">
							<div
								className="inset-0 flex flex-col items-center justify-center text-center text-muted-foreground cursor-pointer">
								<div className="text-md">
									<CloudUploadIcon className="w-16 h-16 mx-auto" />
									<p className="text-sm">Drag and drop files here</p>
									<p className="text-xs">or</p>
									<p className="text-sm">Select file</p>
								</div>
								<p className="mt-2 text-xs text-zinc-400">
									Supported formats: PDF, JPEG, PNG, GIF, BMP, WebP
								</p>
							</div>
						</div>
					</SelectZone>
				</div>
				<div className="max-w-md w-full flex flex-col gap-5">
					<DocPreUpload />
					<UploadProgress />
					<UploadButton />
				</div>
			</div>
		</div>
	);
}

export default UploadScreen;