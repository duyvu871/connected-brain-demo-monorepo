import type { FC } from 'react';
import React from 'react';
import { Box, Center, Flex } from '@mantine/core';
import { CircularProgress } from '@nextui-org/react';


interface ProgressLabelProps {
	value: number;
}

const ProgressLabel: FC<ProgressLabelProps> = ({ value }) => {
	return (
		<Flex align="center" className="" direction="column" justify="center">
			<Box className="text-green-400 text-xl font-semibold">{value}%</Box>
			<Box className="text-zinc-300/70 text-xs">Completed</Box>
		</Flex>
	);
};

function Progress() {
	return (
		<Center className="w-full max-w-lg h-full gap-5">
			<CircularProgress
				aria-label="Loading..."
				classNames={{
					base: 'relative block',
					track: 'bg-zinc-700',
					value: 'text-white',
					label: 'text-white absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%]	',
					indicator: 'stroke-green-500 h-2',
					svg: 'stroke-white w-24 h-24 ',
				}}
				label={<ProgressLabel value={70} />}
				size="sm"
				value={70}
				color="success"
				// showValueLabel={true}
				strokeWidth={1}
			/>
		</Center>
	);
}

export default Progress;