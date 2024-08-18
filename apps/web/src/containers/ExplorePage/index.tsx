"use client"
import ExploreHeader from '@/components/Explore/header.tsx';
import ExploreContent from '@/components/Explore/content.tsx';

export default function ExplorePage() {
	return (
		<div className="grid grid-rows-[auto] [grid-auto-rows:1fr] relative [--explore-width:minmax(0,_1200px)] [--explore-margin:minmax(24px,_1fr)] grid-cols-[var(--explore-margin)_var(--explore-width)_var(--explore-margin)]">
			<div className="col-[1/-1] grid grid-rows-[auto] [grid-auto-rows:1fr] relative [--explore-width:minmax(0,_1200px)] [--explore-margin:minmax(24px,_1fr)] grid-cols-[var(--explore-margin)_var(--explore-width)_var(--explore-margin)]" >
				<div className="col-[1/-1]">
					<ExploreHeader />
					<ExploreContent />
				</div>
			</div>
		</div>
	)
}