import { Link } from '@tanstack/react-router';
import './main-menu.styles.css';
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/auth.context';

type MainMenuProps = {
	visibility: boolean;
};

export const MainMenu = ({ visibility }: MainMenuProps) => {
	const { currentUser } = useAuth();
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
					<Link to='/phrases' className='btn btn--wide btn--bordered'>
						Phrases
					</Link>
				</li>
				{!!currentUser && (
					<li className='main-menu__item'>
						{/* <Link
							to={`/words/${currentUser.uid}`}
							params={{ userId: currentUser.uid }}
							className='btn btn--wide btn--bordered'
						>
							Own Collection
						</Link> */}
					</li>
				)}
			</menu>
		</nav>
	);
};
