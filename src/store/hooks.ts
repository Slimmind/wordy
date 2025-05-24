// src/store/hooks.ts
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './store';

// Используй этот хук вместо стандартного useDispatch
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <TSelected>(selector: (state: RootState) => TSelected) =>
  useSelector(selector);