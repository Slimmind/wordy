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

	console.log('PHRASES: ', phrases);

	return (
		<InternalWindow mod='phrases'>
			<ul className='phrases'>
				{phrases.map((phrase: WordDetail, idx: number) => (
					<Block tag='li' key={idx}>
						{phrase?.value}
					</Block>
				))}
			</ul>
		</InternalWindow>
	);
};
