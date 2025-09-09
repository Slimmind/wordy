import { useMemo, lazy } from 'react';
import { ItemType, ItemTypes } from '../../utils/constants';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import './words.styles.css';

type WordsProps = {
	userId?: string;
};

const WordGroup = lazy(() => import('../word-group'));

export const Words = ({ userId }: WordsProps) => {
	const { items } = useSelector((state: RootState) => state.firestore);

	// Проверяем, что у всех элементов есть необходимые поля
	const validItems = items.filter((item) => {
		if (!item.id) {
			console.error('Item is missing required "id" field:', item);
			return false;
		}
		if (!item.original) {
			console.error('Item is missing required "original" field:', item);
			return false;
		}
		return true;
	});

	const collection = useMemo(() => {
		const words = validItems.filter((item) => item.type === ItemTypes.WORD);
		return userId
			? words.filter((word) => word.owners?.includes(userId))
			: words;
	}, [validItems, userId]);

	const letters = useMemo(() => {
		return [
			...new Set(
				collection
					.map((word) => word.letter)
					.filter((letter): letter is string => !!letter)
			),
		].sort();
	}, [collection]);

	return (
		<ul className='words'>
			{letters.map((letter) => (
				<WordGroup
					key={letter}
					group={collection.filter((word: ItemType) => word.letter === letter)}
					letter={letter as string}
				/>
			))}
		</ul>
	);
};
