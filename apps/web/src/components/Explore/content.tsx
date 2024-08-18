import ExploreStack from '@/components/Explore/explore-stack.tsx';

export default function ExploreContent() {
	return (
			<div className="cols-[1/-1] mx-auto my-[--explore-margin] min-h-[100vh_-_168px] max-w-full w-[calc(1200px_+_calc(2_*_24px))] p-5 sm:p-10 " >
				<div className="mb-8">
					<div className="" >
						<ExploreStack />
					</div>
				</div>
			</div>
	);
}