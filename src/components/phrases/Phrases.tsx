import { useMemo } from 'react';
import { useFirestore } from '../../contexts/firestore.context';
import InternalWindow from '../internal-window';
import { PhraseType, WordDetailType, WordType } from '../../utils/constants';
import './phrases.styles.css';
import { Phrase } from '../phrase/Phrase';

export const Phrases = () => {
	const { phrases, words } = useFirestore();

	const collection = useMemo<(PhraseType | WordDetailType)[]>(() => {
		const wordExamples = words.flatMap((word: WordType) => word.examples);
		return [...phrases, ...wordExamples];
	}, [phrases, words]);

	return (
		<InternalWindow mod='phrases'>
			<ul className='phrases'>
				{collection.map((item: PhraseType | WordDetailType, idx: number) => (
					<Phrase data={item} key={idx} />
				))}
			</ul>
		</InternalWindow>
	);
};
