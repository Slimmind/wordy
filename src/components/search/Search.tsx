import { ChangeEvent, useMemo, useState } from 'react';
import { useFirestore } from '../../contexts/firestore.context';
import { ItemTypes, type ItemType } from '../../utils/constants';
import Input from '../input';
import InternalWindow from '../internal-window';
import Word from '../word';

export const Search = () => {
	const { items } = useFirestore();
	const [searchQuery, setSearchQuery] = useState<string>('');

	const handleInputChange = (
		event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	): void => {
		if (event.target.value.length > 1) {
			setSearchQuery(event.target.value);
		}
	};

	const filteredItems = useMemo(
		() =>
			items
				.filter((item) => item.type === ItemTypes.WORD)
				.filter(
					({ original, translations }: ItemType) =>
						original.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
						translations.find(({ value }) =>
							value?.startsWith(searchQuery.toLocaleLowerCase())
						)
				),
		[searchQuery, items]
	);

	return (
		<InternalWindow title='Search'>
			<Input
				type='search'
				id='search'
				onChange={handleInputChange}
				placeholder='Start typing the word...'
			/>
			{!!filteredItems.length && !!searchQuery && (
				<ul>
					{filteredItems.map((item) => (
						<Word key={item.id} word={item} />
					))}
				</ul>
			)}
		</InternalWindow>
	);
};
