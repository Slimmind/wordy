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
	const collection = useMemo(() => {
		const words = items.filter(
			(item) => item.id && item.original && item.type === ItemTypes.WORD,
		);
		return userId
			? words.filter((word) => word.owners?.includes(userId))
			: words;
	}, [items, userId]);

	const letters = useMemo(() => {
		return [
			...new Set(
				collection
					.map((word) => word.letter)
					.filter((letter): letter is string => !!letter)
			),
		].sort();
	}, [collection]);

	const groups = useMemo(() => {
		const map = new Map<string, ItemType[]>();
		for (const word of collection) {
			if (!word.letter) continue;
			const list = map.get(word.letter);
			if (list) list.push(word);
			else map.set(word.letter, [word]);
		}
		return map;
	}, [collection]);

	return (
		<ul className='words'>
			{letters.map((letter) => (
				<WordGroup
					key={letter}
					group={groups.get(letter) ?? []}
					letter={letter as string}
				/>
			))}
		</ul>
	);
};
