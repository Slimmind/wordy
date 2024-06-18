import { useMemo } from 'react';
import { useFirestore } from '../../contexts/firestore.context';
import { WordType } from '../../utils/constants';
import './words.styles.css';
import WordGroup from '../word-group';

export const Words = () => {
	const { words } = useFirestore();
	const letters = useMemo(
		() => [...new Set(words.map((word: WordType) => word.letter))].sort(),
		[words]
	);
	return (
		<ul className='words'>
			{letters.map((letter: string, idx: number) => (
				<WordGroup
					key={idx}
					group={words.filter((word: WordType) => word.letter === letter)}
					letter={letter}
				/>
			))}
		</ul>
	);
};
