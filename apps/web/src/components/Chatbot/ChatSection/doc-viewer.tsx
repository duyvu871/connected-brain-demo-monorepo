import React, { useState } from 'react';
import DocumentViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import "@cyntler/react-doc-viewer/dist/index.css";
import { Dialog, DialogDescription, DialogOverlay, DialogTitle, DialogTrigger } from '@ui/shadcn-ui/ui/dialog.tsx';
import {Cross2Icon } from '@radix-ui/react-icons';
import { DialogPortal } from '@radix-ui/react-dialog';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cn } from '@repo/utils';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { ReferenceLinkType } from 'types/apps/chatbot/api.type.ts';
import styled from "styled-components";

interface DocViewerProps {
	doc: {uri: string, fileType: string, fileName: string};
};

const DocumentViewerRestyled = styled(DocumentViewer)`
  border-radius: 10px;
	& #msdoc-iframe {
			height: 60svh;
	}	
`;

function DocViewer({doc}: DocViewerProps) {
	const [open, setOpen] = useState(false);
	const icon = {
		doc: (
			<svg height="50" viewBox="0 0 48 48" width="50" x="0px" xmlns="http://www.w3.org/2000/svg" y="0px">
				<path d="M37,45H11c-1.657,0-3-1.343-3-3V6c0-1.657,1.343-3,3-3h19l10,10v29C40,43.657,38.657,45,37,45z"
							fill="#2196f3" />
				<path d="M40 13L30 13 30 3z" fill="#bbdefb" />
				<path d="M30 13L40 23 40 13z" fill="#1565c0" />
				<path d="M15 23H33V25H15zM15 27H33V29H15zM15 31H33V33H15zM15 35H25V37H15z" fill="#e3f2fd" />
			</svg>
		),
		pdf: (
			<svg height="50" id="Layer_1" version="1.1" viewBox="0 0 309.267 309.267" width="50"
					 xmlns="http://www.w3.org/2000/svg">
			<g>
				<path d="M38.658,0h164.23l87.049,86.711v203.227c0,10.679-8.659,19.329-19.329,19.329H38.658
					c-10.67,0-19.329-8.65-19.329-19.329V19.329C19.329,8.65,27.989,0,38.658,0z" style={{fill: '#E2574C'}} />
				<path d="M289.658,86.981h-67.372c-10.67,0-19.329-8.659-19.329-19.329V0.193L289.658,86.981z" style={{fill: '#B53629'}} />
				<path d="M217.434,146.544c3.238,0,4.823-2.822,4.823-5.557c0-2.832-1.653-5.567-4.823-5.567h-18.44
					c-3.605,0-5.615,2.986-5.615,6.282v45.317c0,4.04,2.3,6.282,5.412,6.282c3.093,0,5.403-2.242,5.403-6.282v-12.438h11.153
					c3.46,0,5.19-2.832,5.19-5.644c0-2.754-1.73-5.49-5.19-5.49h-11.153v-16.903C204.194,146.544,217.434,146.544,217.434,146.544z
					 M155.107,135.42h-13.492c-3.663,0-6.263,2.513-6.263,6.243v45.395c0,4.629,3.74,6.079,6.417,6.079h14.159
					c16.758,0,27.824-11.027,27.824-28.047C183.743,147.095,173.325,135.42,155.107,135.42z M155.755,181.946h-8.225v-35.334h7.413
					c11.221,0,16.101,7.529,16.101,17.918C171.044,174.253,166.25,181.946,155.755,181.946z M106.33,135.42H92.964
					c-3.779,0-5.886,2.493-5.886,6.282v45.317c0,4.04,2.416,6.282,5.663,6.282s5.663-2.242,5.663-6.282v-13.231h8.379
					c10.341,0,18.875-7.326,18.875-19.107C125.659,143.152,117.425,135.42,106.33,135.42z M106.108,163.158h-7.703v-17.097h7.703
					c4.755,0,7.78,3.711,7.78,8.553C113.878,159.447,110.863,163.158,106.108,163.158z" style={{fill: '#FFFFFF'}} />
			</g>
			</svg>
		),
	}

	const checkFileType = (fileType: `${ReferenceLinkType}`) => {
		if (fileType === ReferenceLinkType.pdf) {
			return 'pdf';
		}
		return 'doc';
	}

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogTrigger asChild>
				<div
					className="relative p-4 cursor-pointer flex flex-col w-[150px] bg-zinc-800 h-40 rounded-lg break-all whitespace-break-spaces">
					<div className="text-sm font-semibold dark:text-zinc-100 text-zinc-600">{doc.fileName}</div>
					<div className="absolute bottom-[10px] right-[10px]">
						<span className="w-14">
							{icon[checkFileType(doc.fileType as `${ReferenceLinkType}`)]}
						</span>
					</div>
				</div>
			</DialogTrigger>
			<DialogPortal>
				<DialogOverlay className="z-[240]" />
				<DialogPrimitive.Content
					className={cn(
						'fixed left-[50%] top-[50%] z-[250] grid w-full translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg',
						'p-5 md:max-w-2xl max-h-[70svh] md:p-0 bg-opacity-0 border-0',
					)}

				>
					<VisuallyHidden.Root asChild>
						<DialogTitle>Choose a model</DialogTitle>
					</VisuallyHidden.Root>
					<VisuallyHidden.Root asChild>
						<DialogDescription>Choose a model</DialogDescription>
					</VisuallyHidden.Root>
					<DocumentViewerRestyled
						documents={[doc]}
						theme={{
							primary: "#5296d8",
							secondary: "#ffffff",
							tertiary: "#5296d899",
							textPrimary: "#ffffff",
							textSecondary: "#5296d8",
							textTertiary: "#00000099",
							disableThemeScrollbar: false,
						}}
					/>
					<DialogPrimitive.Close
						className="absolute right-7 top-7 sm:right-2 sm:top-2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
						<Cross2Icon className="h-4 w-4" />
						<span className="sr-only">Close</span>
					</DialogPrimitive.Close>
				</DialogPrimitive.Content>
			</DialogPortal>
		</Dialog>
	);
}

export default DocViewer;