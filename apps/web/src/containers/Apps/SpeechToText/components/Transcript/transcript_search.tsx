import React from 'react';
import { useAtom } from 'jotai';
import { transcriptSearch } from '@/containers/Apps/SpeechToText/states/transcript';
import { useDebouncedValue } from '@mantine/hooks';
import { SearchIcon } from '@nextui-org/shared-icons';
import { Input } from '@nextui-org/input';

function TranscriptSearch() {
	const [search, setSearch] = useAtom(transcriptSearch);
	const [debounced, cancel] = useDebouncedValue(search, 1000);
	const updateSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(e.target.value);
	};
	return (
		// <Box>
		<Input
			autoComplete="off"
			autoCorrect="off"
			className=""
			classNames={{
				base: 'w-full max-w-md',
				input: 'bg-zinc-400 text-white/90 dark:bg-zinc-950 dark:text-white/90 rounded-lg',
				inputWrapper: 'rounded-lg bg-zinc-400 border border-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 group-data-[focus=true]:bg-zinc-900 dark:group-data-[focus=true]:bg-zinc-900',
			}}
			isClearable
			onChange={updateSearch}
			placeholder="Type to search..."
			radius="lg"
			size="md"
			spellCheck="false"
			startContent={
				<SearchIcon
					className="text-black/50 mb-0.5 mx-1 dark:text-white/90 text-zinc-400 pointer-events-none flex-shrink-0" />
			}
		/>
		// </Box>
	);
}

export default TranscriptSearch;