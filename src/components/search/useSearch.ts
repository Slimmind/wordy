// src/hooks/useSearch.ts
import { useMemo, useState, useEffect, useCallback } from 'react';
import { ItemType, ItemTypes } from '../../utils/constants';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

export const useSearch = () => {
	const items = useSelector((state: RootState) => state.firestore.items);

	// Разделяем слова и фразы
	const words = useMemo(
		() => items.filter((item) => item.type === ItemTypes.WORD),
		[items]
	);

	const phrases = useMemo(
		() => items.filter((item) => item.type === ItemTypes.PHRASE),
		[items]
	);

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

	// Хук для запуска поиска с задержкой
	useEffect(() => {
		const timer = setTimeout(() => {
			updateSearchResults('');
		}, 300);

		return () => clearTimeout(timer);
	}, [updateSearchResults]);

	return {
		searchResults,
		updateSearchResults,
	};
};
