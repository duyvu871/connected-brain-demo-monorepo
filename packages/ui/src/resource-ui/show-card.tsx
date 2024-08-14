import { motion } from 'framer-motion';
import React, {useState} from 'react';
import './styles/show_card.css';
import { cn } from '@repo/utils';
import { RiMenuSearchLine, RiRobot3Line, RiUserVoiceLine, RiVoiceprintFill } from 'react-icons/ri';
import { PiIdentificationCard } from 'react-icons/pi';

const featuresList1: {
	title: string;
	description: string;
	href: string;
	image: string;
	icon?: React.ReactNode;
	iconColor?: string;
}[] = [
	{
		title: 'OCR',
		description: 'OCR lets you turn images of typed text, handwriting, or PDF documents into searchable and editable text.',
		href: '/services/ocr',
		image: '/preview-images/img_1.png',
		icon: <RiMenuSearchLine size={26} />,
		// iconColor: '#',
	},
	{
		title: 'Assistant',
		description: 'Helps you find information on the web, check the weather, open apps, and perform other tasks.',
		href: '/services/assistant',
		image: '/preview-images/img_2.png',
		icon: <RiRobot3Line size={26} />,
	},
];
const featuresList2: typeof featuresList1 = [
	{
		title: 'Speech to Text',
		description: 'Enables applications, computers, and software systems to understand and translate human-provided speech data into text.',
		href: '/services/speech-to-text',
		image: '/preview-images/img_3.png',
		icon: <RiVoiceprintFill size={26} />,
	},
	{
		title: 'Identifies speaker',
		description: 'Allows to differentiate and identify speakers based on how they pronounce, speaking rate, tone and other characteristics',
		href: '/services/identify-speaker',
		image: '/preview-images/img_4.png',
		icon: <PiIdentificationCard size={26} />,
	},
];

const featuresList3: typeof featuresList1 = [
	{
		title: 'Conversation',
		description: 'Allows converting real-time conversations to text and translating conversations into other languages at the same time',
		href: '/services/conversation',
		image: '/preview-images/img_5.png',
		icon: <RiUserVoiceLine size={24} />,
	},
];

// interface FeatureItemRenderProps {
// 	itemList?: {
// 		title: string;
// 		description: string;
// 		href: string;
// 		image: string;
// 		icon?: React.ReactNode;
// 		iconColor?: string
// 	}[];
// }

function FeatureItemRender({ itemList = [] }: { itemList: typeof featuresList1 }): React.ReactNode {
	const [currentHover, setCurrentHover] = useState<string>('');
	return (
		<>
			{itemList.map((feature, index) => (
				<div
					className="bg-black/80 overflow-hidden transition-all w-72 relative flex flex-col justify-start items-start rounded-2xl aspect-square max-w-xl shadow"
					key={`feature-list-1-${index}`}
					onMouseEnter={() => {
						if (currentHover !== '') {
							return;
						}
						setCurrentHover(feature.title);
					}}
					onMouseLeave={() => {
						setCurrentHover('');
					}}
				>
					<div
						className="absolute z-30 top-4 right-4 w-[40px] h-[40px] rounded-lg bg-gray-300/20 backdrop-blur-[4px] flex justify-center items-center">
						{feature.icon}
					</div>
					<div className="w-full h-full overflow-hidden">
						<motion.div
							animate={currentHover === feature.title ? {
								scale: 1.2,
								transition: {
									delay: 0.2,
									duration: 0.4,
								},
							} : 'rest'}
							className="w-full h-full relative "
							initial={{
								backgroundImage: `url(${feature.image})`,
								backgroundSize: 'cover',
								backgroundRepeat: 'no-repeat',
								backgroundPosition: '0px -9px',
							}}
						/>
					</div>
					<div className="h-fit border-0 border-t-[1px] border-gray-900">
						<motion.div
							animate={currentHover === feature.title ? {} : 'rest'}
							className="relative z-20 p-7 pr-2 pt-2 rounded-b-xl flex flex-col justify-center items-start gap-3 "
							initial={{
								transform: 'translateY(0%)',
							}}
						>
							<div className="flex justify-between items-center w-full"
							>
										<span
											className="text-white text-xl font-extrabold transition-[color_0.2s,font-size_0.01s]"
										>
										{feature.title}
										</span>
							</div>
							<motion.span
								animate={{
									transition: {
										delay: 0.1,
									},
								}}
								className={cn('text-xs text-gray-300 h-11 line-clamp-3 shadow')}>{feature.description}</motion.span>
						</motion.div>
						<div
							className="backdrop-blur-[6px] h-0 w-full absolute z-10 bottom-0 transition-all showCardHoverContent" />
					</div>
				</div>
			))}
		</>
	);
};

function ShowCard(): React.ReactNode {
	// const [currentHover, setCurrentHover] = React.useState<string>('');
	return (
		<div className="w-full bg-[#16181b73] p-14 flex justify-center items-center">
			<div className="h-min max-w-5xl flex flex-col justify-center items-center gap-10 ">
				<div className="max-w-5xl flex flex-wrap justify-center items-center gap-10">
					<FeatureItemRender itemList={featuresList1} />
					<FeatureItemRender itemList={featuresList2} />
					<FeatureItemRender itemList={featuresList3} />
				</div>
				<div className="flex justify-center items-center gap-10" />
			</div>
		</div>
	);
}

export default ShowCard;