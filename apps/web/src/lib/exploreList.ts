import type React from 'react';
import { PiNetworkLight, PiScan } from "react-icons/pi";
import type { IconType } from 'react-icons';
import { MdOutlineTranslate } from "react-icons/md";
import { RiChatVoiceLine } from "react-icons/ri";
import { GrChatOption } from "react-icons/gr";

export type ExploreItem = {
	title: string;
	icon?: IconType;
	description?: string;
	items?: {
		title: string;
		href: string;
		icon?: {
			href?: string;
			icon?: IconType;
		};
		description?: string;
	}[];
}

export const exploreList: ExploreItem[] = [
	{
		title: "Use Cases",
		description: "Chose from a variety of use cases to get started",
		icon: PiNetworkLight,
		items: [
			{
				title: "AI Chatbot",
				href: "/app/chatbot",
				icon: {
					href: "/explore-image/bordered-chat.svg"
				},
				description: "Build a chatbot to automate customer service"
			},
			{
				title: "Detect Words and Text",
				href: "/app/ocr",
				icon: {
					href: "/explore-image/picture-star.svg"
				},
				description: "Extract text from images and documents with OCR technology"
			},
			{
				title: "Extract text from speech",
				href: "/app/speech-to-text",
				icon: {
					href: "/explore-image/voice-record.svg"
				},
				description: "Convert audio to text with speech recognition "
			}
		]
	},
	{
		title: "All Products",
		description: "Explore all AI products",
		items: [
			{
				title: "Chatbot",
				href: "/app/chatbot",
				icon: {
					icon: GrChatOption
				},
				description: "Provide automated responses to customer queries. Customize the chatbot to suit your needs"
			},
			{
				title: "OCR",
				href: "/app/ocr",
				icon: {
					icon: PiScan
				},
				description: "Extract text from images, documents, and PDFs with Optical Character Recognition"
			},
			{
				title: "Speech to Text",
				href: "/app/speech-to-text",
				icon: {
					icon: RiChatVoiceLine
				},
				description: "Convert audio to text with speech recognition, and transcribe audio files"
			},
			{
				title: "Translation",
				href: "/app/translate",
				icon: {
					icon: MdOutlineTranslate
				},
				description: "Translate text between languages with machine translation and high-quality neural machine translation"
			}
		]
	}
]