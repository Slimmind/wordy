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
  const { items } = useFirestore();
  const [userCollection, setUserCollection] = useState<ItemType[]>([]);

  useEffect(() => {
    setUserCollection(
      userId ? items.filter((item) => Array.isArray(item.owners) && item.owners.includes(userId)) : items
    );
  }, [items, userId]);

  return (
    <InternalWindow title='Your own collection' mod='own-collection'>
      <ul className='own-collection'>
        {userCollection.map((word: ItemType) => (
          <li key={word.id} className='own-collection__item'>
            <Word word={word} />
          </li>
        ))}
      </ul>
    </InternalWindow>
  );
};
