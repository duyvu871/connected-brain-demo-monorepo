import type { FC } from 'react';
import React from 'react';
import { Box, Flex } from '@mantine/core';
import { time } from '@repo/utils';
import { useAtom } from 'jotai/index';
import { audioDuration } from '@/containers/Apps/SpeechToText/states/jotai';

const { formatMillisecondsToMinutesSeconds } = time;

const DurationTime: FC<any> = () => {
	const [duration, _] = useAtom<number>(audioDuration);
	return (
		<Flex align="start" className=" flex-grow" direction="column" justify="center">
			<Box className="text-green-400 text-3xl font-semibold">{formatMillisecondsToMinutesSeconds(duration)}</Box>
			<Box className="text-gray-300/70 text-sm">Minutes processed</Box>
		</Flex>
	);
};

function Duration() {
	return (
		<Flex align="center" className="gap-5 p-5" justify="center">
			<Box className="flex-grow">
				<svg fill="none" height="100" viewBox="0 0 287 251" width="100" xmlns="http://www.w3.org/2000/svg">
					<rect fill="#53C269" height="100" rx="5" width="10" x="36" y="75" />
					<rect fill="#53C269" height="80" rx="5" width="10" x="18" y="84" />
					<rect fill="#53C269" height="50" rx="5" width="10" y="98" />
					<rect fill="#53C269" height="200" rx="5" width="10" x="53" y="25" />
					<rect fill="#53C269" height="50" rx="5" width="10" x="104" y="100" />
					<rect fill="#53C269" height="250" rx="5" width="10" x="87" />
					<rect fill="#BEBEBE" height="250" rx="5" width="10" x="140" />
					<rect fill="#53C269" height="130" rx="5" width="10" x="121" y="60" />
					<rect fill="#53C269" height="150" rx="5" width="10" x="70" y="50" />
					<rect fill="#BEBEBE" height="100" rx="5" transform="rotate(-180 252.254 174.255)" width="10" x="252.254"
								y="174.255" />
					<rect fill="#BEBEBE" height="70" rx="5" transform="rotate(-180 269.254 158.255)" width="10" x="269.254"
								y="158.255" />
					<rect fill="#BEBEBE" height="50" rx="5" transform="rotate(-180 286.254 149.255)" width="10" x="286.254"
								y="149.255" />
					<rect fill="#BEBEBE" height="200" rx="5" transform="rotate(-180 235.254 224.551)" width="10" x="235.254"
								y="224.551" />
					<rect fill="#BEBEBE" height="50" rx="5" transform="rotate(-180 184.263 150.44)" width="10" x="184.263"
								y="150.44" />
					<rect fill="#BEBEBE" height="250" rx="5" transform="rotate(-180 201.261 250.145)" width="10" x="201.261"
								y="250.145" />
					<rect fill="#BEBEBE" height="130" rx="5" transform="rotate(-180 167.266 190.737)" width="10" x="167.266"
								y="190.737" />
					<rect fill="#BEBEBE" height="150" rx="5" transform="rotate(-180 218.256 199.847)" width="10" x="218.256"
								y="199.847" />
				</svg>
			</Box>
			<DurationTime />
		</Flex>
	);
}

export default Duration;