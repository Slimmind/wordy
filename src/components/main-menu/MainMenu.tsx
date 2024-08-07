import { Link } from '@tanstack/react-router';
import './main-menu.styles.css';
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/auth.context';
import { PhrasesIcon } from '../../icons/phrases-icon';
import { HeartIcon } from '../../icons/heart-icon';
import Button from '../button';

export const MainMenu = () => {
	const { currentUser } = useAuth();
	const [isMenuOpened, setIsMenuOpened] = useState<boolean>();

	function hideMenu(): void {
		console.log('HIDE');
		setIsMenuOpened(false);
	}

	function showMenu(): void {
		setIsMenuOpened(true);
	}

	function handleClick(): void {
		hideMenu();
	}

	useEffect(() => {
		document.addEventListener('mousedown', handleClick);
		return () => {
			document.removeEventListener('mousedown', handleClick);
		};
	}, []);

	return (
		<div>
			<Button mod='circle menu' aria-label='menu button' onClick={showMenu} />
			<nav
				className={`main-menu ${isMenuOpened ? 'main-menu--visible' : ''}`}
				onClick={hideMenu}
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
