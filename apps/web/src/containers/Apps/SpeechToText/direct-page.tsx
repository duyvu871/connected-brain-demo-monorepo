import Link from 'next/link'
import Image from 'next/image'
import type { LucideIcon } from 'lucide-react';
import { Mic, FileText, Clock, Upload } from 'lucide-react';
import type { IconType } from 'react-icons';
import { Flex } from '@mantine/core';

type LinkBoxProps = {
	href: string
	title: string
	description: string
	icon: LucideIcon|IconType
	imageSrc: string
	features: { icon: JSX.Element, text: string }[]
}

const LinkBox = ({ href, title, description, icon: Icon, imageSrc, features }: LinkBoxProps) => (
	<div className="rounded-lg p-1 bg-zinc-50 dark:bg-zinc-700 shadow-md hover:shadow-xl transition-all duration-300 ease-in-out overflow-hidden transform hover:-translate-y-1">
		<Link className="group block bg-zinc-50 dark:bg-zinc-800 rounded-lg " href={href}>
			<div className="p-6 flex flex-col h-full">
				<div className="flex items-center mb-4">
					<Icon className="w-8 h-8 mr-3 text-zinc-600 dark:text-zinc-300 group-hover:text-zinc-800 dark:group-hover:text-zinc-100 transition-colors duration-300" />
					<h2 className="text-2xl font-semibold text-zinc-700 dark:text-zinc-100 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors duration-300">{title}</h2>
				</div>
				<div className="relative w-full h-40 mb-4 rounded-md overflow-hidden">
					<Image
						alt={title}
						className="transition-transform duration-300 group-hover:scale-110"
						layout="fill"
						objectFit="cover"
						src={imageSrc}
					/>
				</div>
				<p className="text-zinc-600 dark:text-zinc-300 group-hover:text-zinc-800 dark:group-hover:text-zinc-200 transition-colors duration-300 mb-4">{description}</p>
				<ul className="text-sm text-zinc-500 dark:text-zinc-400 space-y-2 mt-auto">
					{features.map((feature, index) => (
						<li className="flex items-center group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors duration-300" key={index}>
							<span className="mr-2 opacity-70 group-hover:opacity-100 transition-opacity duration-300">{feature.icon}</span>
							{feature.text}
						</li>
					))}
				</ul>
			</div>
		</Link>
	</div>
)

export default function DirectPage() {
	return (
		<Flex className="flex-col min-h-[100svh] bg-zinc-50 dark:bg-zinc-950 overflow-x-hidden" w="100%">
			<div className="mx-auto p-5">
				<h1 className="text-4xl font-bold text-center mb-8 text-zinc-700 dark:text-zinc-100">
					Welcome to Our Transcription Service
				</h1>
				<p className="text-center text-zinc-600 dark:text-zinc-300 mb-12 max-w-2xl mx-auto">
					Choose from our two powerful transcription options: real-time for instant results or file upload for
					pre-recorded content. Get accurate, efficient transcripts for all your audio needs.
				</p>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto p-4">
					<LinkBox
						description="Generate accurate transcripts in real-time as you speak. Perfect for live events, meetings, and instant note-taking."
						features={[
							{ icon: <Clock className="w-4 h-4" />, text: "Instant transcription" },
							{ icon: <Mic className="w-4 h-4" />, text: "Multiple speaker detection" },
							{ icon: <FileText className="w-4 h-4" />, text: "Export in various formats" },
						]}
						href="/realtime-transcript"
						icon={Mic}
						imageSrc="/placeholder.svg"
						title="Real-time Transcript"
					/>
					<LinkBox
						description="Upload pre-recorded audio files and get highly accurate transcriptions. Ideal for podcasts, interviews, and archival content."
						features={[
							{ icon: <Upload className="w-4 h-4" />, text: "Supports various audio formats" },
							{ icon: <Clock className="w-4 h-4" />, text: "Fast processing times" },
							{ icon: <FileText className="w-4 h-4" />, text: "Advanced editing tools" },
						]}
						href="/transcribe"
						icon={FileText}
						imageSrc="/placeholder.svg"
						title="Transcribe Audio"
					/>
				</div>
			</div>
		</Flex>
	)
}

