import { ChangeEvent, useMemo, useState } from 'react';
import { useFirestore } from '../../contexts/firestore.context';
import { type WordType } from '../../utils/constants';
import Input from '../input';
import InternalWindow from '../internal-window';
import Word from '../word';

export const Search = () => {
	const { words } = useFirestore();
	const [searchQuery, setSearchQuery] = useState<string>('');

	const handleInputChange = (
		event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	): void => {
		if (event.target.value.length > 1) {
			setSearchQuery(event.target.value);
		}
	};

	const filteredWords = useMemo(
		() =>
			words.filter(
				({ original, translations }: WordType) =>
					original.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
					translations.find(({ value }) =>
						value?.startsWith(searchQuery.toLocaleLowerCase())
					)
			),
		[searchQuery, words]
	);

	return (
		<InternalWindow title='Search'>
			<Input
				type='search'
				id='search'
				onChange={handleInputChange}
				placeholder='Start typing the word...'
			/>
			{!!filteredWords.length && !!searchQuery && (
				<ul>
					{filteredWords.map((word) => (
						<Word key={word.id} word={word} />
					))}
				</ul>
			)}
		</InternalWindow>
	);
};
