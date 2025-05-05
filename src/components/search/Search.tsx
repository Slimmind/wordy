import { lazy, ChangeEvent, useState, useMemo, useCallback } from 'react';
import { useFirestore } from '../../contexts/firestore.context';
import { ItemType, ItemTypes } from '../../utils/constants';
import { Link } from '@tanstack/react-router';
import { debounce } from '../../utils/debounce';
import Input from '../input';
import InternalWindow from '../internal-window';
import Word from '../word';

const Button = lazy(() => import('../button'));

export const Search = () => {
	const { items } = useFirestore();
	const [searchInputValue, setSearchInputValue] = useState<string>('');
	const [searchResults, setSearchResults] = useState<ItemType[]>([]);
	const [displayValue, setDisplayValue] = useState<string>('');

	const words = useMemo(
		() => items.filter((item) => item.type === ItemTypes.WORD),
		[items]
	);
	const phrases = useMemo(
		() => items.filter((item) => item.type === ItemTypes.PHRASE),
		[items]
	);

	const filterWords = useCallback(
		(query: string) => {
			return words.filter(({ original }) =>
				original.toLowerCase().startsWith(query)
			);
		},
		[words]
	);

	const filterPhrases = useCallback(
		(query: string) => {
			return phrases.filter(({ original }) =>
				original.split(' ').some((word) => word.toLowerCase().startsWith(query))
			);
		},
		[phrases]
	);

	const updateSearchResults = useCallback(
		debounce((query: string) => {
			if (query.length > 0) {
				const filteredWords = filterWords(query);
				const filteredPhrases = filterPhrases(query);
				setSearchResults([...filteredWords, ...filteredPhrases]);
			} else {
				setSearchResults([]);
			}
		}, 300),
		[filterWords, filterPhrases]
	);

	const handleInputChange = useCallback(
		(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
			const value = event.target.value;
			setDisplayValue(value); // Мгновенное обновление отображаемого значения
			const searchQuery = value.toLowerCase();
			setSearchInputValue(searchQuery);
			updateSearchResults(searchQuery);
		},
		[updateSearchResults]
	);

	return (
		<InternalWindow title='Search'>
			<Input
				key='search-input'
				type='search'
				id='search'
				value={displayValue}
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
			{searchInputValue && searchResults.length === 0 && (
				<>
					<p>Ой!.. Такого слова еще нет в списке :(</p>
					<p>
						Хотите{' '}
						<Link
							to='/add-item/$searchQuery'
							params={{ searchQuery: searchInputValue }}
						>
							<Button>добавить</Button>
						</Link>{' '}
						его?
					</p>
				</>
			)}
		</InternalWindow>
	);
};
