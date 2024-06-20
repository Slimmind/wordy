import { Link } from '@tanstack/react-router';
import './main-menu.styles.css';
import { useEffect, useState } from 'react';
// import Button from '../button';
// import { THEME_DARK, THEME_LIGHT } from '../../utils/constants';
// import { useTheme } from '../../contexts/theme.context';

type MainMenuProps = {
	visibility: boolean;
};

export const MainMenu = ({ visibility }: MainMenuProps) => {
	// const { theme, changeTheme } = useTheme();
	const [isMenuOpened, setIsMenuOpened] = useState<boolean>(visibility);

	// const toggleTheme = (): void => {
	// 	const newTheme = theme === THEME_LIGHT ? THEME_DARK : THEME_LIGHT;
	// 	changeTheme(newTheme);
	// };

	function hideMenu(): void {
		setIsMenuOpened(false);
	}

	useEffect(() => {
		setIsMenuOpened(visibility);
	}, [visibility]);

	return (
		<nav
			className={`main-menu ${isMenuOpened ? 'main-menu--visible' : ''}`}
			onClick={hideMenu}
		>
			<menu>
				<li className='main-menu__item'>
					<Link to='/phrases' className='btn btn--wide btn--bordered'>
						Phrases
					</Link>
				</li>
				<li className='main-menu__item'>
					<Link to='/phrases' className='btn btn--wide btn--bordered'>
						Own Collection
					</Link>
				</li>
				{/* <li className='main-menu__item'>
					<Link to='/phrases' className='btn btn--wide'>
						Games
					</Link>
				</li> */}
			</menu>
			{/* <div className='main-menu__theme-switcher'>
				<Button onClick={toggleTheme}>Dark Theme</Button>
				<Button onClick={toggleTheme}>Light Theme</Button>
			</div> */}
		</nav>
	);
};
