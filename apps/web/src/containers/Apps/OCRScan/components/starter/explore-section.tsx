import { Box } from '@mantine/core';
import ExploreIllustration from '@/containers/Apps/OCRScan/components/starter/explore-illustation';

export default function ExploreSection(): JSX.Element {
	return (
		<section className="grid gap-4 pt-10 sm:pt-20">
			<Box className="w-full flex justify-center items-center">
				<h2 className="text-4xl text-zinc-100 font-semibold">Explore</h2>
			</Box>
			<Box className="grid gap-6 w-[inherit]">
				<ExploreIllustration />
			</Box>
		</section>
	);
}