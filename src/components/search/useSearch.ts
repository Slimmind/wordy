import { useMemo, useState, useCallback } from 'react';
import { ItemType, ItemTypes } from '../../utils/constants';
import { useSelector, shallowEqual } from 'react-redux';
import { RootState } from '../../store/store';

export const useSearch = () => {
  // Получаем items с оптимизацией сравнения
  const items = useSelector((state: RootState) => state.firestore.items, shallowEqual);

  // Разделяем слова и фразы с useMemo
  const { words, phrases } = useMemo(() => {
    const words = items.filter((item) => item.type === ItemTypes.WORD);
    const phrases = items.filter((item) => item.type === ItemTypes.PHRASE);
    return { words, phrases };
  }, [items]);

  // Локальное состояние поиска
  const [searchResults, setSearchResults] = useState<ItemType[]>([]);

  // Функция поиска (стабильная)
  const updateSearchResults = useCallback(
    (query: string) => {
      if (query.length < 2) {
        setSearchResults([]);
        return;
      }

      const filteredWords = words.filter(({ original }) =>
        original.toLowerCase().startsWith(query)
      );

      const filteredPhrases = phrases.filter(({ original }) =>
        original.split(' ').some((word) => word.toLowerCase().startsWith(query))
      );

      setSearchResults([...filteredWords, ...filteredPhrases]);
    },
    [words, phrases]
  );

  return {
    searchResults,
    updateSearchResults,
  };
};