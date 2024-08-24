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
			className=" max-w-sm "
			classNames={{
				input: 'bg-gray-900 text-white/90 dark:bg-gray-800 dark:text-white/90 rounded-full',
				inputWrapper: 'rounded-2xl bg-gray-900 dark:bg-gray-800 group-data-[focus=true]:bg-gray-900 dark:group-data-[focus=true]:bg-gray-800',
			}}
			isClearable
			onChange={updateSearch}
			placeholder="Type to search..."
			radius="lg"
			size="md"
			spellCheck="false"
			startContent={
				<SearchIcon
					className="text-black/50 mb-0.5 mx-1 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
			}
		/>
		// </Box>
	);
}

export default TranscriptSearch;