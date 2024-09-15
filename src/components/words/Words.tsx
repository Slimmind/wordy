import { useMemo, lazy } from 'react';
import { useFirestore } from '../../contexts/firestore.context';
import { ItemType, ItemTypes } from '../../utils/constants';
import './words.styles.css';

type WordsProps = {
	userId?: string;
};

const WordGroup = lazy(() => import('../word-group'));

export const Words = ({ userId }: WordsProps) => {
	const { items } = useFirestore();

	const collection = useMemo(() => {
		const words = items.filter((item) => item.type === ItemTypes.WORD);
		return userId
			? words.filter((word) => word.owners?.includes(userId))
			: words;
	}, [items, userId]);

	const letters = useMemo(() => {
		return [...new Set(collection.map((word) => word.letter))].sort();
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
