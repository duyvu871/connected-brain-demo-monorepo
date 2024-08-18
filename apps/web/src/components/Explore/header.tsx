import React from 'react';
import Link from 'next/link';


export default function ExploreHeader() {

	return (
		<header className="col-[1/-1] flex items-center justify-between p-4 sm:px-10 border-b border-zinc-800 dark:text-zinc-50 text-zinc-900">
			<div className="max-w-full mx-auto w-[calc(1200px_+_calc(2_*_24px))] px-[--explore-margin]">
				<div className="flex flex-col relative max-w-full sm:justify-start items-stretch">
					<div className="py-8">
						<div className="w-full">
							<div className="grid gap-4 items-center grid-cols-[1fr_min-content]">
								<h1 className="text-3xl font-semibold m-0 text-zinc-50">Explore AI Integrations</h1>
								<p className="text-sm text-zinc-400 max-w-[800px] mt-0 col-start-1 col-span-2">
									Explore AI integrations and find the best tools to help you build your AI
									projects.
									<Link className="text-primary-500 px-1" href="/explore-image">
										Learn more
									</Link>
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
}