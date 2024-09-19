import React, { useRef, useState } from 'react';
import { FaPause, FaPlay } from 'react-icons/fa';

interface AudioPlayerProps {
	src: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src }) => {
	const audioRef = useRef<HTMLAudioElement>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const [source, setSource] = useState(src);

	const handlePlayPause = () => {
		if (isPlaying) {
			audioRef.current?.pause();
		} else {
			void audioRef.current?.play();
		}
		setIsPlaying(!isPlaying);
	};

	const formatTime = (time: number) => {
		const minutes = Math.floor(time / 60);
		const seconds = Math.floor(time % 60);
		return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
	};

	return (
		<div className="bg-zinc-900 rounded-lg p-4 shadow-md">
			<audio
				onEnded={() => setIsPlaying(false)}
				onLoadedData={(e) => {
					console.log(e.currentTarget.duration);
					setDuration(e.currentTarget.duration);
				}}
				onTimeUpdate={(e) => {
					setCurrentTime(e.currentTarget.currentTime);
				}}
				ref={audioRef}
				src={source}
			/>

			<div className="flex items-center justify-between gap-2">
				<div className="text-zinc-400 text-sm">
					{formatTime(currentTime)}
				</div>

				<div className="flex items-center">
					<button
						className="bg-zinc-700 text-white rounded-full w-8 h-8 flex items-center justify-center mr-2 focus:outline-none"
						onClick={handlePlayPause}
						type="button"
					>
						{isPlaying ? (
							<FaPause />
						) : (
							<FaPlay />
						)}
					</button>
				</div>
			</div>

			{/*<div className="w-full h-2 bg-zinc-700 rounded-full mt-2 overflow-hidden">*/}
			{/*	/!*<div*!/*/}
			{/*	/!*	className="h-full bg-indigo-500 transition-all"*!/*/}
			{/*	/!*	style={{ width: `${(currentTime) * 100}%` }}*!/*/}
			{/*	/!*></div>*!/*/}
			{/*</div>*/}
		</div>
	);
};

export default AudioPlayer;