import { ChangeEvent, useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import Input from '../input';
import InternalWindow from '../internal-window';
import Word from '../word';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { listenToItems } from '../../store/firebase';
import { useSearch } from './useSearch';
import Button from '../button';

export const Search = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { error } = useSelector((state: RootState) => state.firestore);
  const { searchResults, updateSearchResults } = useSearch();

  const [displayValue, setDisplayValue] = useState<string>('');

  // Подписка на данные из Firebase
  useEffect(() => {
    const unsubscribe = dispatch(listenToItems());
    return () => {
      unsubscribe();
    };
  }, [dispatch]);

  // Запуск поиска при изменении displayValue
  useEffect(() => {
    updateSearchResults(displayValue);
  }, [displayValue, updateSearchResults]);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = event.target.value.toLowerCase();
    setDisplayValue(value);
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <InternalWindow title='Search'>
      <Input
        type='search'
        id='search'
        value={displayValue}
        onChange={handleInputChange}
        placeholder='Start typing the word...'
        autoFocus
      />
      {searchResults.length > 0 && (
        <ul>
          {searchResults.map((item) => (
            <Word key={item.id} word={item} searchQuery={displayValue} />
          ))}
        </ul>
      )}
      {displayValue.length > 1 && searchResults.length === 0 && (
        <>
          <p>Ой!.. Такого слова еще нет в списке :(</p>
          <p>
            Хотите{' '}
            <Link
              to='/add-item/$searchQuery'
              params={{ searchQuery: displayValue }}
            >
              <Button>добавить</Button>
            </Link>{' '}
            его?
          </p>
        </>
      )}
    </InternalWindow>
  );
};
