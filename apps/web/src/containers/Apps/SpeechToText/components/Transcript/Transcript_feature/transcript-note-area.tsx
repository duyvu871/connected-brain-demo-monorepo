import React from 'react';

function TranscriptNoteArea() {
	return (
		<div className="flex h-full w-full flex-col">
			<textarea
				className="flex w-full rounded-md border border-zinc-800 transition-colors bg-transparent text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border focus-visible:border-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 flex-1 p-4"
				placeholder="Note here" />
		</div>
	);
}

export default TranscriptNoteArea;