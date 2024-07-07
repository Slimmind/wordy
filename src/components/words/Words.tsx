import { useEffect, useMemo, useState } from 'react';
import { useFirestore } from '../../contexts/firestore.context';
import { WordType } from '../../utils/constants';
import './words.styles.css';
import WordGroup from '../word-group';

type WordsProps = {
	userId?: string;
};

export const Words = ({ userId }: WordsProps) => {
	const { words } = useFirestore();
	const [collection, setCollection] = useState<WordType[]>([]);

	useEffect(() => {
		setCollection(
			userId ? words.filter((word) => word.owners?.includes(userId)) : words
		);
	}, [words, userId]);

	const letters = useMemo(() => {
		return [...new Set(collection.map((word) => word.letter))].sort();
	}, [collection]);

	return (
		<ul className='words'>
			{letters.map((letter: string, idx: number) => (
				<WordGroup
					key={idx}
					group={collection.filter((word: WordType) => word.letter === letter)}
					letter={letter}
				/>
			))}
		</ul>
	);
};
