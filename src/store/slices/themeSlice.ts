import { createSlice } from '@reduxjs/toolkit';
import { STORAGE_KEYS } from '../../utils/constants';

interface ThemeState {
  isDark: boolean;
}

const initialState: ThemeState = {
  isDark: JSON.parse(localStorage.getItem(STORAGE_KEYS.THEME) || 'false'),
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.isDark = !state.isDark;
      localStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(state.isDark));
      document.documentElement.classList.toggle('dark', state.isDark);
    },
    setTheme: (state, action) => {
      state.isDark = action.payload;
      localStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(state.isDark));
      document.documentElement.classList.toggle('dark', state.isDark);
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;