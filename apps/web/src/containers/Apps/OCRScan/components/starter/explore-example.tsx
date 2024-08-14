import { Box } from '@mantine/core';

export default function ExploreExample(): JSX.Element {
	return (
		<Box className="grid gap-4">
			<Box className="w-full flex justify-center items-center">
				<h2 className="text-4xl text-zinc-100 font-semibold">Example</h2>
			</Box>
			<Box className="grid gap-6 w-[inherit]" />
		</Box>
	);
}