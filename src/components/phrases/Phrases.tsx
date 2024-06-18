import React, { useMemo } from 'react';
import InternalWindow from '../internal-window';
import Block from '../block';
import { useFirestore } from '../../contexts/firestore.context';
import { WordDetail, WordType } from '../../utils/constants';
import './phrases.styles.css';

export const Phrases: React.FC = () => {
	const { words } = useFirestore();

	const phrases = useMemo<WordDetail[]>(() => {
		return words.flatMap((word: WordType) => word.examples);
	}, [words]);

	return (
		<InternalWindow>
			<ul className='phrases'>
				{phrases.map((phrase: WordDetail) => (
					<Block tag='li' key={phrase.id}>
						{phrase.value}
					</Block>
				))}
			</ul>
		</InternalWindow>
	);
};
