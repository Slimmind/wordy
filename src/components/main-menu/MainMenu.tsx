import { Link } from '@tanstack/react-router';
import { useState, lazy } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import './main-menu.styles.css';

type MainMenuProps = {
	openMenuHandler: (isOpen: boolean) => void;
};

const Button = lazy(() => import('../button'));
const PhrasesIcon = lazy(() => import('../../icons/phrases-icon'));
const HeartIcon = lazy(() => import('../../icons/heart-icon'));
const ThemeSwitcher = lazy(() => import('../theme-switcher'));

export const MainMenu = ({ openMenuHandler }: MainMenuProps) => {
	const currentUser = useSelector((state: RootState) => state.auth.currentUser);
	const [isMenuOpened, setIsMenuOpened] = useState<boolean>(false);

	const hideMenu = () => {
		setIsMenuOpened(false);
		openMenuHandler(false);
	};

	const showMenu = () => {
		setIsMenuOpened(true);
		openMenuHandler(true);
	};

	const clickHandler = () => {
		hideMenu();
	};

	return (
		<div>
			<Button
				mod='circle menu'
				aria-label='menu button'
				onClick={isMenuOpened ? hideMenu : showMenu}
			/>
			<nav
				className={`main-menu ${isMenuOpened ? 'main-menu--visible' : ''}`}
				onClick={clickHandler}
			>
				<ThemeSwitcher />
				<menu>
					<li className='main-menu__item'>
						<Link to='/phrases' className='btn btn--wide btn--bordered'>
							<PhrasesIcon />
							<span className='btn__text'>Phrases</span>
						</Link>
					</li>
					{!!currentUser && (
						<li className='main-menu__item'>
							<Link
								to={`/own-collection/$userId`}
								params={{ userId: currentUser.uid }}
								className='btn btn--wide btn--bordered'
							>
								<HeartIcon />
								<span className='btn__text'>Own Collection</span>
							</Link>
						</li>
					)}
				</menu>
			</nav>
		</div>
	);
};
