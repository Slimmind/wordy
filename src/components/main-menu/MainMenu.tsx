import { Link } from '@tanstack/react-router';
import './main-menu.styles.css';
import { useState } from 'react';
import { useAuth } from '../../contexts/auth.context';
import { PhrasesIcon } from '../../icons/phrases-icon';
import { HeartIcon } from '../../icons/heart-icon';
import Button from '../button';

export const MainMenu = () => {
	const { currentUser } = useAuth();
	const [isMenuOpened, setIsMenuOpened] = useState<boolean>(false);

	const hideMenu = () => {
		console.log('HIDE');
		setIsMenuOpened(false);
	};

	const showMenu = () => {
		console.log('SHOW');
		setIsMenuOpened(true);
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
