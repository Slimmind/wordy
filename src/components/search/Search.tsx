import { ChangeEvent, useState, useMemo, lazy } from 'react';
import { useFirestore } from '../../contexts/firestore.context';
import { ItemType, ItemTypes } from '../../utils/constants';

const Input = lazy(() => import('../input'));
const InternalWindow = lazy(() => import('../internal-window'));
const Word = lazy(() => import('../word'));

export const Search = () => {
	const { items } = useFirestore();
	const [searchInputValue, setSearchInputValue] = useState<string>('');
	const [searchResults, setSearchResults] = useState<ItemType[]>([]);

	const words = useMemo(
		() => items.filter((item) => item.type === ItemTypes.WORD),
		[items]
	);
	const phrases = useMemo(
		() => items.filter((item) => item.type === ItemTypes.PHRASE),
		[items]
	);

	const filterWords = (query: string) => {
		return words.filter(({ original }) =>
			original.toLowerCase().startsWith(query)
		);
	};

	const filterPhrases = (query: string) => {
		return phrases.filter(({ original }) =>
			original.split(' ').some((word) => word.toLowerCase().startsWith(query))
		);
	};

	const handleInputChange = (
		event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	): void => {
		const searchQuery = event.target.value.toLowerCase();
		if (!searchQuery) {
			setSearchResults([]);
			return;
		}

		const filteredWords = filterWords(searchQuery);
		const filteredPhrases = filterPhrases(searchQuery);

		setSearchInputValue(searchQuery);
		setSearchResults([...filteredWords, ...filteredPhrases]);
	};

	return (
		<InternalWindow title='Search'>
			<Input
				type='search'
				id='search'
				onChange={handleInputChange}
				placeholder='Start typing the word...'
				autoFocus
			/>
			{searchResults.length > 0 && (
				<ul>
					{searchResults.map((item) => (
						<Word key={item.id} word={item} searchQuery={searchInputValue} />
					))}
				</ul>
			)}
		</InternalWindow>
	);
};
