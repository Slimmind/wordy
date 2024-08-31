import { useEffect, useState } from 'react';
import { useFirestore } from '../../contexts/firestore.context';
import InternalWindow from '../internal-window';
import { ItemType } from '../../utils/constants';
import Word from '../word';
import './own-collection.styles.css';

type OwnCollectionProps = {
	userId: string;
};

export const OwnCollection = ({ userId }: OwnCollectionProps) => {
	console.log('USER_ID: ', userId);
	const { items } = useFirestore();
	const [collection, setCollection] = useState<ItemType[]>([]);

	useEffect(() => {
		setCollection(
			userId ? items.filter((item) => item.owners?.includes(userId)) : items
		);
	}, [items, userId]);
	return (
		<InternalWindow title='Your own collection' mod='own-collection'>
			<ul className='own-collection'>
				{collection.map((word: ItemType) => (
					<li className='own-collection__item'>
						<Word key={word.id} word={word} />
					</li>
				))}
			</ul>
		</InternalWindow>
	);
};
