import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ThemeState {
  theme: string;
}

const loadThemeFromLocalStorage = (): string => {
  return localStorage.getItem('appTheme') || 'light';
};

const initialState: ThemeState = {
  theme: loadThemeFromLocalStorage(),
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    changeTheme: (state, action: PayloadAction<string>) => {
      state.theme = action.payload;
      localStorage.setItem('appTheme', action.payload);
    },
  },
});

export const { changeTheme } = themeSlice.actions;

export const selectTheme = (state: { theme: ThemeState }) => state.theme.theme;

export default themeSlice.reducer;