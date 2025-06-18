import { useMemo, lazy, useState, useRef, useEffect } from 'react';
import { ItemType, ItemTypes } from '../../utils/constants';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { listenToItems } from '../../store/firebase';
import './phrases.styles.css';

const Phrase = lazy(() => import('../phrase'));
const InternalWindow = lazy(() => import('../internal-window'));
const Button = lazy(() => import('../button'));

export const Phrases = () => {
  console.log('Redux state:', useSelector((state: RootState) => state.firestore));
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error } = useSelector((state: RootState) => state.firestore);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const phrasesRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    dispatch(listenToItems());
  
  // Firestore сам управляет подпиской, явная отписка не всегда нужна
  return () => {
    // Можно оставить пустым или добавить действие для очистки
  };
}, [dispatch]);

  useEffect(() => {
    console.log('Current items:', items);
    console.log('Loading state:', loading);
    console.log('Error state:', error);
  }, [items, loading, error]);

  const collection = useMemo(() => {
    if (!items) return [];
    
    const wordExamples = items
      .filter(
        (item) =>
          item.type === 'word' && item.examples && item.examples.length > 0
      )
      .flatMap((item) =>
        item.examples
          ? item.examples.map((example) => ({
              value: example.value,
              id: example.id,
              wordId: item.id,
              translations: example.translations,
            }))
          : []
      );

    const phrases: ItemType[] = items.filter(
      (item) => item.type === ItemTypes.PHRASE
    );

    return [...phrases, ...wordExamples];
  }, [items]);

  const paginatedCollection = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return collection.slice(startIndex, startIndex + itemsPerPage);
  }, [collection, currentPage]);

  const totalPages = Math.ceil(collection.length / itemsPerPage);

  const changePage = (newPage: number) => {
    setCurrentPage(newPage);
    if (phrasesRef.current) {
      phrasesRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  if (error) return <div>Error loading phrases: {error}</div>;

  return (
    <InternalWindow mod='phrases' title='Phrases'>
      <ul className='phrases' ref={phrasesRef}>
        {paginatedCollection.map((item) => (
          <Phrase data={item} key={item.id} />
        ))}
      </ul>
      <div className="phrases__pagination">
        <Button 
          mod='circle arrow-left'
          onClick={() => changePage(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="previous page"
        />
        <span>Page {currentPage} of {totalPages}</span>
        <Button
          mod='circle arrow-right'
          disabled={currentPage === totalPages}
          onClick={() => changePage(currentPage + 1)}
          aria-label="next page"
        />
      </div>
    </InternalWindow>
  );
};