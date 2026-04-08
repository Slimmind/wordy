/**
 * Redux slice for Firestore vocabulary state.
 * Database operations have been moved to src/services/firestore.ts
 * Use src/hooks/useVocabulary.ts for component-level access.
 */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
	collection,
	onSnapshot,
	addDoc,
	deleteDoc,
	updateDoc,
	doc,
} from 'firebase/firestore';
import db from '../firebase';
import type {
	ItemType as ItemTypeZod,
	ItemDetailType,
} from '../schemas/item.schema';
import { parseItemsArray } from '../schemas/item.schema';
import type { AppDispatch } from './store';

/**
 * Input type for creating/updating vocabulary items.
 * More permissive than the validated schema type — allows partial optional fields.
 */
export interface CreateItemInput {
	id: string;
	type: 'word' | 'phrase';
	letter: string;
	original: string;
	synonyms?: ItemDetailType[];
	translations: ItemDetailType[];
	examples?: ItemDetailType[];
	owners?: string[];
	keyWords?: string[];
	canExtend?: boolean;
}

interface FirestoreState {
	items: ItemTypeZod[];
	loading: boolean;
	error: string | null;
}

const initialState: FirestoreState = {
	items: [],
	loading: false,
	error: null,
};

// Асинхронные действия

export const createItem = createAsyncThunk(
	'firestore/createItem',
	async (item: CreateItemInput, thunkAPI) => {
		try {
			const docRef = await addDoc(collection(db, 'vocabulary'), item);
			return { ...item, id: docRef.id };
		} catch (error) {
			return thunkAPI.rejectWithValue(
				error instanceof Error ? error.message : 'Failed to add item',
			);
		}
	},
);

export const deleteItem = createAsyncThunk(
	'firestore/deleteItem',
	async (itemId: string, thunkAPI) => {
		try {
			await deleteDoc(doc(db, 'vocabulary', itemId));
			return itemId;
		} catch (error) {
			return thunkAPI.rejectWithValue(
				error instanceof Error ? error.message : 'Delete failed',
			);
		}
	},
);

export const changeItem = createAsyncThunk(
	'firestore/changeItem',
	async (
		{
			itemId,
			updatedFields,
		}: { itemId: string; updatedFields: Partial<CreateItemInput> },
		thunkAPI,
	) => {
		try {
			await updateDoc(doc(db, 'vocabulary', itemId), updatedFields);
			return { id: itemId, ...updatedFields };
		} catch (error) {
			return thunkAPI.rejectWithValue(
				error instanceof Error ? error.message : 'Failed to update item',
			);
		}
	},
);

// Slice

const firestoreSlice = createSlice({
	name: 'firestore',
	initialState,
	reducers: {
		setItems: (state, action: PayloadAction<ItemTypeZod[]>) => {
			state.items = action.payload;
		},
		setLoading: (state, action: PayloadAction<boolean>) => {
			state.loading = action.payload;
		},
		setError: (state, action: PayloadAction<string | null>) => {
			state.error = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(createItem.fulfilled, (state, action) => {
				state.items.push(action.payload as unknown as ItemTypeZod);
			})
			.addCase(deleteItem.fulfilled, (state, action) => {
				state.items = state.items.filter((item) => item.id !== action.payload);
			})
			.addCase(changeItem.fulfilled, (state, action) => {
				const index = state.items.findIndex(
					(item) => item.id === action.payload.id,
				);
				if (index !== -1) {
					state.items[index] = {
						...state.items[index],
						...action.payload,
					} as unknown as ItemTypeZod;
				}
			});
	},
});

// Экшены
export const { setLoading, setError, setItems } = firestoreSlice.actions;
export { firestoreSlice };

/**
 * Thunk for subscribing to the vocabulary collection.
 * NOTE: This loads the ENTIRE collection. For filtered queries,
 * use services/firestore.ts directly (subscribeToItemsByLetter, etc.)
 */
export const listenToItems = () => {
	return (dispatch: AppDispatch) => {
		dispatch(setLoading(true));

		const unsubscribe = onSnapshot(
			collection(db, 'vocabulary'),
			(snapshot) => {
				const rawItems = snapshot.docs.map((docSnap) => ({
					id: docSnap.id,
					...docSnap.data(),
				}));
				// Validate items through Zod, filter out invalid ones
				const validItems = parseItemsArray(rawItems);
				dispatch(firestoreSlice.actions.setItems(validItems));
				dispatch(setLoading(false));
			},
			(error) => {
				console.error('Firestore subscription error:', error);
				dispatch(setError(error.message));
				dispatch(setLoading(false));
			},
		);

		return () => unsubscribe();
	};
};

export default firestoreSlice.reducer;
