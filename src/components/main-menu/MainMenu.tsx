import { Link } from '@tanstack/react-router';
import './main-menu.styles.css';
import { useEffect, useState } from 'react';

type MainMenuProps = {
	visibility: boolean;
};

export const MainMenu = ({ visibility }: MainMenuProps) => {
	const [isMenuOpened, setIsMenuOpened] = useState<boolean>(visibility);
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
					<Link to='/phrases' className='btn btn--wide'>
						Phrases
					</Link>
				</li>
				<li className='main-menu__item'>
					<Link to='/phrases' className='btn btn--wide'>
						Phrases
					</Link>
				</li>
				<li className='main-menu__item'>
					<Link to='/phrases' className='btn btn--wide'>
						Phrases
					</Link>
				</li>
			</menu>
		</nav>
	);
};
