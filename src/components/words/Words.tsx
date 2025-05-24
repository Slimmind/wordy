import { useMemo, lazy, useEffect } from 'react';
import { ItemType, ItemTypes } from '../../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { listenToItems } from '../../store/firebase';
import './words.styles.css';

type WordsProps = {
	userId?: string;
};

const WordGroup = lazy(() => import('../word-group'));

export const Words = ({ userId }: WordsProps) => {
	const dispatch = useDispatch<AppDispatch>();
  const { items } = useSelector((state: RootState) => state.firestore);
  
  useEffect(() => {
    const unsubscribe = dispatch(listenToItems());
    return () => unsubscribe();
  }, [dispatch]);

	const collection = useMemo(() => {
		const words = items.filter((item) => item.type === ItemTypes.WORD);
		return userId
			? words.filter((word) => word.owners?.includes(userId))
			: words;
	}, [items, userId]);

	const letters = useMemo(() => {
		return [...new Set(collection.map((word) => word.letter))].sort();
	}, [collection]);

	return (
		<ul className='words'>
			{letters.map((letter) => (
				<WordGroup
					key={letter}
					group={collection.filter((word: ItemType) => word.letter === letter)}
					letter={letter as string}
				/>
			))}
		</ul>
	);
};
