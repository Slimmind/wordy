// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth';
import firestoreReducer from './firebase';
import themeReducer from './theme'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    firestore: firestoreReducer,
    theme: themeReducer,
  },
});

// Типизация для использования в компонентах и thunks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;