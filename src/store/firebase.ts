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
import { ItemType } from '../utils/constants';
import { AppDispatch } from './store';

interface FirestoreState {
  items: ItemType[];
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
  async (item: ItemType, thunkAPI) => {
    try {
      const docRef = await addDoc(collection(db, 'vocabulary'), item);
      return { ...item, id: docRef.id };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error instanceof Error ? error.message : 'Failed to add item'
      );
    }
  }
);

export const deleteItem = createAsyncThunk(
  'firestore/deleteItem',
  async (itemId: string, thunkAPI) => {
    try {
      await deleteDoc(doc(db, 'vocabulary', itemId));
      return itemId;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error instanceof Error ? error.message : 'Delete failed'
      );
    }
  }
);

export const changeItem = createAsyncThunk(
  'firestore/changeItem',
  async (
    { itemId, updatedFields }: { itemId: string; updatedFields: Partial<ItemType> },
    thunkAPI
  ) => {
    try {
      await updateDoc(doc(db, 'vocabulary', itemId), updatedFields);
      return { id: itemId, ...updatedFields };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error instanceof Error ? error.message : 'Failed to update item'
      );
    }
  }
);

// Slice

const firestoreSlice = createSlice({
  name: 'firestore',
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<ItemType[]>) => {
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
        state.items.push(action.payload);
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(changeItem.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = {
            ...state.items[index],
            ...action.payload,
          };
        }
      });
  },
});

// Экшены
export const { setLoading, setError } = firestoreSlice.actions;

// Thunk для подписки на коллекцию
// Замените старый listenToItems на это:
export const listenToItems = () => {
  return (dispatch: AppDispatch) => {
    dispatch(setLoading(true));

    const unsubscribe = onSnapshot(
      collection(db, 'vocabulary'),
      (snapshot) => {
        const items = snapshot.docs.map(
          (docSnap) => ({ id: docSnap.id, ...docSnap.data() }) as ItemType
        );
        dispatch(firestoreSlice.actions.setItems(items));
        dispatch(setLoading(false));
      },
      (error) => {
        console.error('Firestore subscription error:', error);
        dispatch(setError(error.message));
        dispatch(setLoading(false));
      }
    );

    return () => unsubscribe();
  };
};

// Редьюсер
export default firestoreSlice.reducer;