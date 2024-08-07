// import { User } from 'firebase/auth';
// import { WordType } from '../../utils/constants';

import { useEffect, useState } from 'react';
import { useFirestore } from '../../contexts/firestore.context';
import InternalWindow from '../internal-window';
import { PhraseType, WordType } from '../../utils/constants';
import Word from '../word';
import './own-collection.styles.css';

type OwnCollectionProps = {
	userId: string;
};

export const OwnCollection = ({ userId }: OwnCollectionProps) => {
	console.log('USER_ID: ', userId);
	const { words } = useFirestore();
	const [collection, setCollection] = useState<WordType[]>([]);

	useEffect(() => {
		setCollection(
			userId ? words.filter((word) => word.owners?.includes(userId)) : words
		);
	}, [words, userId]);
	return (
		<InternalWindow title='Your own collection' mod='own-collection'>
			<ul className='own-collection'>
				{collection.map((word: WordType | PhraseType) => (
					<li className='own-collection__item'>
						<Word key={word.id} word={word} />
					</li>
				))}
			</ul>
		</InternalWindow>
	);
};
