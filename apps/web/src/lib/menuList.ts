import type {
	LucideIcon} from 'lucide-react';
import { MessageSquareQuote,
 Voicemail,

	Tag,
	Users,
	Settings,
	Bookmark,
	SquarePen,
	LayoutGrid,
    Split,
    Fingerprint
} from 'lucide-react';

import { TbChartBubble, TbTextScan2 } from "react-icons/tb";
import type { IconType } from 'react-icons';
import { BsTranslate } from 'react-icons/bs';

type Submenu = {
	href: string;
	label: string;
	active: boolean;
};

type Menu = {
	href: string;
	label: string;
	active: boolean;
	icon: LucideIcon | IconType;
	submenus: Submenu[];
};

type Group = {
	groupLabel: string;
	menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
	return [
		{
			groupLabel: "",
			menus: [
				{
					href: "/explore",
					label: "Explore",
					active: pathname.includes("/explore"),
					icon: LayoutGrid,
					submenus: []
				}
			]
		},
		{
			groupLabel: "Apps",
			menus: [
				{
					href: "/app/chatbot",
					label: "Chatbot",
					active: pathname.includes("/app/chatbot"),
					icon: MessageSquareQuote,
					submenus: [
						// {
						// 	href: "/app/chatbot",
						// 	label: "New Session",
						// 	active: false
						// },
					]
				},
				{
					href: "/app/speech-to-text",
					label: "Speech to Text",
					active: pathname.includes("/app/speech-to-text"),
					icon: Voicemail,
					submenus: [
						{
							href: "/app/speech-to-text/realtime-transcript",
							label: "Realtime Transcript",
							active: pathname.includes("/app/speech-to-text/realtime-transcript")
						},
						{
							href: "/app/speech-to-text/transcribe",
							label: "Transcribe",
							active: pathname.includes("/app/speech-to-text/transcribe")
						},
					]
				},
				{
					href: "/app/text-to-speech",
					label: "Text to Speech",
					active: pathname.includes("/app/text-to-speech"),
					icon: TbChartBubble,
					submenus: []
				},
				{
					href: "/app/ocr",
					label: "OCR",
					active: pathname.includes("/app/ocr"),
					icon: TbTextScan2,
					submenus: []
				},
				{
					href: "/app/translate",
					label: "Translation",
					active: pathname.includes("/app/translate"),
					icon: BsTranslate,
					submenus: []
				},
				{
					href: '/app/voice-separation',
					label: "Voice Separation",
					active: pathname.includes("/app/voice-separation"),
					icon: Split,
					submenus: []
				},
				{
					href: '/app/voice-identification',
					label: "Voice Identification",
					active: pathname.includes("/app/voice-identification"),
					icon: Fingerprint,
					submenus: []
				}
			]
		},
		{
			groupLabel: "Settings",
			menus: [
				{
					href: "/users",
					label: "Users",
					active: pathname.includes("/users"),
					icon: Users,
					submenus: []
				},
				{
					href: "/account",
					label: "Account",
					active: pathname.includes("/account"),
					icon: Settings,
					submenus: []
				}
			]
		}
	];
}