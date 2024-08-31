import { useMemo } from 'react';
import { useFirestore } from '../../contexts/firestore.context';
import InternalWindow from '../internal-window';
import { ItemDetailType, ItemType, ItemTypes } from '../../utils/constants';
import { Phrase } from '../phrase/Phrase';
import './phrases.styles.css';

export const Phrases = () => {
  const { items } = useFirestore();

  const collection = useMemo(() => {
    const wordExamples: ItemDetailType[] = items
      .filter((item) => item.type === ItemTypes.WORD)
      .flatMap((word: ItemType) => word.examples)
      .filter((example): example is ItemDetailType => example !== undefined);

    const phrases: ItemType[] = items.filter((item) => item.type === ItemTypes.PHRASE);

    console.log('TEST: ', [...phrases, ...wordExamples]);
    return [...phrases, ...wordExamples];

  }, [items]);

  return (
    <InternalWindow mod="phrases" title="Phrases">
      <ul className="phrases">
        {collection.map((item: ItemType | ItemDetailType) => (
          <Phrase data={item} key={item.id} />
        ))}
      </ul>
    </InternalWindow>
  );
};
