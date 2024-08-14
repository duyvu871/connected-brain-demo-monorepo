import React from 'react';
import { Progress as ProgressNextui } from '@nextui-org/react';
import { useAtom } from 'jotai';
import { progress as progressData } from '@/containers/Apps/OCRScan/states/starter.ts';

function Progress() {
	const [progress] = useAtom(progressData);

	return (
		<ProgressNextui
			className="max-w-md"
			classNames={{
				label: "text-zinc-800 capitalize",
			}}
			color="success"
			formatOptions={{style: "percent"}}
			label={progress.label}
			maxValue={100}
			showValueLabel
			size="sm"
			value={Number(((progress.progress)*100).toFixed(2))}
		/>
	);
}

export default Progress;