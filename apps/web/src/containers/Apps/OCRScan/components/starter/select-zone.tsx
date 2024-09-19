import React from 'react';
import { useAtom } from 'jotai/index';
import { openForwardedDialog, starterAssetsPreUpload } from '@/containers/Apps/OCRScan/states/starter';
import { useToast } from '@/hooks/useToast';
import { useAuth } from '@/hooks/useAuth.ts';
import { routeList } from '@/global/contants/route.ts';
import { isPDFAtom, pdfPageStore } from '@/containers/Apps/OCRScan/states/playground.ts';
import { usePathname } from 'next/navigation';

const allowedFileTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'application/pdf'];

type SelectZoneProps = {
	children?: React.ReactNode;
}

export default function SelectZone({children}:  SelectZoneProps): React.ReactNode {
	const pathName = usePathname();
	const { error } = useToast();
	const [, setFile] = useAtom(starterAssetsPreUpload);
	const [, setDialogState]= useAtom(openForwardedDialog);
	const [, setIsPDF] = useAtom(isPDFAtom);
	const [, setPDFStore] = useAtom(pdfPageStore);

	const { isLogin } = useAuth();
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		// console.log(file)
		if (file) {
			let isPDF = false;
			const fileExtension = file.name.split('.').pop()?.toLowerCase();
			if (isLogin && fileExtension?.includes('pdf') && pathName !== '/app/ocr/p') {
				console.log('isLogin', isLogin);
				setDialogState({
					forwardUrl: `/app/ocr/p`,
					forwardTitle: 'Continue with playground app to continue processing PDF extension',
					isOpened: true
				});
				return;
			}
			if (isLogin && fileExtension?.includes('pdf')) {
				isPDF = true;
			}
			const isValidFileType = allowedFileTypes.includes(file.type);
			console.log('fileExtension', fileExtension);
			setIsPDF(isPDF);
			if (isValidFileType) {
				setPDFStore(null);
				setFile(file);
			} else {
				error('Invalid file type. Please select a correct file.');
				e.target.value = ''; // Clear the input
			}
		} else {
			setFile(null);
		}
	};

	return (
		<div className="flex items-center justify-center w-full">
			<label className="flex flex-col items-center justify-center rounded-lg cursor-pointer hover:bg-zinc-700 bg-zinc-100 dark:bg-zinc-800 group transition-all w-full"
						 htmlFor="dropzone-file">
				{!children ? <div className="flex items-center justify-center gap-1 px-2 py-1 h-10">
					<svg aria-hidden="true"
							 className="w-5 h-5 group-hover:text-zinc-100 transition-all text-zinc-500 dark:text-zinc-400"
							 fill="none" viewBox="0 0 20 16" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
							stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
							strokeWidth="2" />
					</svg>
					<p className="text-zinc-600 dark:text-zinc-100 group-hover:text-zinc-100 transition-all ">Image</p>
				</div> : children}
				<input
					accept=".png, .jpeg, .jpg, .gif, .pdf, image/*, application/pdf"
					className="hidden"
					id="dropzone-file"
					onChange={handleFileChange}
					type="file"
				/>
			</label>
			<div className="" />
		</div>
	);
}