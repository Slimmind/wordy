import { useEffect, useState } from 'react';
import { useFirestore } from '../../contexts/firestore.context';
import { WordType } from '../../utils/constants';
import Block from '../block';
import './letter-navigation.styles.css';

type LetterNavigationProps = {
	userId?: string;
};

export const LetterNavigation = ({ userId }: LetterNavigationProps) => {
	const { words } = useFirestore();
	const [letters, setLetters] = useState<string[]>([]);

	useEffect(() => {
		const preparedWordCollection = userId
			? words.filter((word) => word.owners?.includes(userId))
			: words;
		const arrayOfUniqLetters = [
			...new Set(preparedWordCollection.map((word: WordType) => word.letter)),
		].sort();
		setLetters(arrayOfUniqLetters);
	}, [words, userId]);

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
