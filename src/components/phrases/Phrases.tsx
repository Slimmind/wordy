import InternalWindow from '../internal-window';
import Block from '../block';
import './phrases.styles.css';
import { useFirestore } from '../../contexts/firestore.context';
import { useMemo } from 'react';
import { WordType } from '../../utils/constants';

export const Phrases = () => {
	const { words } = useFirestore();
	const phrases = useMemo(
		() => [...new Set(words.flatMap((word: WordType) => word.examples))],
		[words]
	);
	return (
		<InternalWindow>
			<ul className='phrases'>
				{phrases.map((phrase: string, idx: number) => (
					<Block tag='li' key={idx}>
						{phrase}
					</Block>
				))}
			</ul>
		</InternalWindow>
	);
};
