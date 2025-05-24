import { lazy, useState } from 'react';
import clsx from 'clsx';
import { Link } from '@tanstack/react-router';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import './footer.styles.css';

const MainMenu = lazy(() => import('../main-menu'));
const Block = lazy(() => import('../block'));

export const Footer = () => {
	const currentUser = useSelector((state: RootState) => state.auth.currentUser);
	const [isMenuOpened, setIsMenuOpened] = useState<boolean>(false);
	const classes = clsx('main-footer', { 'main-footer--active': isMenuOpened });

	return (
		<footer className={classes}>
			<Block>
				<Link
					to='/search'
					className='btn btn--circle btn--search'
					aria-label='search button'
				/>
				<MainMenu
					openMenuHandler={(isOpen: boolean) => setIsMenuOpened(isOpen)}
				/>
				{currentUser?.email && (
					<Link
						to='/add-item'
						className='btn btn--circle btn--plus'
						aria-label='add word button'
					/>
				)}
			</Block>
		</footer>
	);
};
