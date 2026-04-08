import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';
import {
	createItem,
	deleteItem,
	changeItem,
	setLoading,
	setError,
} from '../store/firebase';
import { firestoreSlice } from '../store/firebase';
import type { ItemType } from '../schemas/item.schema';
import { searchItems } from '../services/firestore';

const { setItems } = firestoreSlice.actions;

/**
 * Hook for vocabulary state and operations.
 * Centralizes access to items, loading state, and CRUD operations.
 */
export function useVocabulary() {
	const dispatch = useDispatch<AppDispatch>();

	const items = useSelector((state: RootState) => state.firestore.items);
	const loading = useSelector((state: RootState) => state.firestore.loading);
	const error = useSelector((state: RootState) => state.firestore.error);

	/** Create a new vocabulary item */
	const createNewItem = useCallback(
		(item: Omit<ItemType, 'id'>) => {
			dispatch(createItem(item as ItemType));
		},
		[dispatch],
	);

	/** Delete a vocabulary item */
	const deleteExistingItem = useCallback(
		(itemId: string) => {
			dispatch(deleteItem(itemId));
		},
		[dispatch],
	);

	/** Update an existing item */
	const updateItem = useCallback(
		(itemId: string, updatedFields: Partial<ItemType>) => {
			dispatch(changeItem({ itemId, updatedFields }));
		},
		[dispatch],
	);

	/** Manually set items (e.g., from a filtered query) */
	const setItemsList = useCallback(
		(newItems: ItemType[]) => {
			dispatch(setItems(newItems));
		},
		[dispatch],
	);

	/** Subscribe to all vocabulary (legacy behavior, use with caution) */
	const subscribeToAll = useCallback(() => {
		return dispatch(
			// Reusing the existing thunk for backwards compatibility
			// In a full migration, this would be replaced by RTK Query
			(async () => {
				dispatch(setLoading(true));
				const { subscribeToAllVocabulary: sub } =
					await import('../services/firestore');
				const unsubscribe = sub(
					(fetchedItems) => {
						dispatch(setItems(fetchedItems));
						dispatch(setLoading(false));
					},
					(err) => {
						dispatch(setError(err.message));
						dispatch(setLoading(false));
					},
				);
				return unsubscribe;
			}) as unknown as AppDispatch,
		);
	}, [dispatch]);

	return {
		items,
		loading,
		error,
		createItem: createNewItem,
		deleteItem: deleteExistingItem,
		updateItem,
		setItems: setItemsList,
		subscribeToAll,
	};
}

/**
 * Hook for searching vocabulary.
 */
export function useVocabularySearch() {
	const [searchResults, setSearchResults] = useState<ItemType[]>([]);
	const [searching, setSearching] = useState(false);
	const [searchError, setSearchError] = useState<string | null>(null);

	const search = useCallback(async (query: string) => {
		if (!query.trim()) {
			setSearchResults([]);
			return;
		}

		setSearching(true);
		setSearchError(null);

		try {
			const results = await searchItems(query);
			setSearchResults(results);
		} catch (err) {
			setSearchError(err instanceof Error ? err.message : 'Search failed');
		} finally {
			setSearching(false);
		}
	}, []);

	return {
		searchResults,
		searching,
		searchError,
		search,
	};
}
