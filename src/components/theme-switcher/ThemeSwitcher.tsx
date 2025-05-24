import { lazy } from 'react';
import { THEME_DARK, THEME_LIGHT } from '../../utils/constants';
import { useDispatch,  useSelector } from 'react-redux';
import { changeTheme } from '../../store/theme';
import { AppDispatch, RootState } from '../../store/store';

import './theme-switcher.styles.css';

const MoonIcon = lazy(() => import('../../icons/moon-icon'));
const SunIcon = lazy(() => import('../../icons/sun-icon'));

export const ThemeSwitcher = () => {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useSelector((state: RootState) => state.theme.theme);

  const toggleTheme = () => {
    const newTheme = theme === THEME_LIGHT ? THEME_DARK : THEME_LIGHT;
    dispatch(changeTheme(newTheme));
  }

	return (
		<div
			role='button'
			className='theme-switcher'
			onClick={toggleTheme}
			aria-label='theme switcher'
		>
			<SunIcon />
			<MoonIcon />
			<div
				className={`theme-switcher__roundel theme-switcher__roundel--${theme}`}
			>
				{theme === THEME_LIGHT ? <SunIcon /> : <MoonIcon />}
			</div>
		</div>
	);
};
