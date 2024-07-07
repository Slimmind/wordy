import { useEffect, useMemo, useState } from 'react';
import { useFirestore } from '../../contexts/firestore.context';
import { WordType } from '../../utils/constants';
import Block from '../block';
import './letter-navigation.styles.css';

type LetterNavigationProps = {
	userId?: string;
};

export const LetterNavigation = ({ userId }: LetterNavigationProps) => {
	const { words } = useFirestore();
	const [collection, setCollection] = useState<WordType[]>(() => {
		return userId
			? words.filter((word) => word.owners?.includes(userId))
			: words;
	});

	useEffect(() => {
		setCollection(
			userId ? words.filter((word) => word.owners?.includes(userId)) : words
		);
	}, [words, userId]);

	const letters = useMemo(
		() => [...new Set(collection.map((word: WordType) => word.letter))].sort(),
		[words]
	);

	return (
		!!letters.length && (
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
		)
	);
};
