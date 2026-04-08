import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store/store';
import { changeTheme } from '../store/theme';

/**
 * Hook for theme state and actions.
 */
export function useTheme() {
	const dispatch = useDispatch();

	const theme = useSelector((state: RootState) => state.theme.theme);

	const toggleTheme = () => {
		const newTheme = theme === 'dark' ? 'light' : 'dark';
		dispatch(changeTheme(newTheme));
	};

	const setTheme = (newTheme: string) => {
		dispatch(changeTheme(newTheme));
	};

	return {
		theme,
		toggleTheme,
		setTheme,
		isDark: theme === 'dark',
	};
}
