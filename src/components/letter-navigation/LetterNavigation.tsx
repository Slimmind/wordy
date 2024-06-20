import { useMemo } from 'react';
import { useFirestore } from '../../contexts/firestore.context';
import { WordType } from '../../utils/constants';
import Block from '../block';
import './letter-navigation.styles.css';

export const LetterNavigation = () => {
	const { words } = useFirestore();
	const letters = useMemo(
		() => [...new Set(words.map((word: WordType) => word.letter))].sort(),
		[words]
	);

	return (
		<nav className='letter__navigation'>
			<Block>
				<ul className='letter__navigation-list'>
					{letters.map((letter: string, idx: number) => (
						<li key={idx} className='letter__navigation-list-item'>
							<a href={`#${letter}`}>{letter}</a>
						</li>
					))}
				</ul>
			</Block>
		</nav>
	);
};
