import { useState, useCallback } from 'react';
import { useAuth } from '../../contexts/auth.context';
import { Link } from '@tanstack/react-router';
import { Button } from '../button/Button';
import MainMenu from '../main-menu';
import Block from '../block';
import './footer.styles.css';

export const Footer = () => {
	const { currentUser } = useAuth();
	const [isMenuOpened, setIsMenuOpened] = useState<boolean>(false);

	const switchMenuVisibility = useCallback(() => {
		setIsMenuOpened((prevState) => !prevState);
	}, []);

	return (
		<footer className='main-footer'>
			<MainMenu visibility={isMenuOpened} />
			<Block>
				<Link
					to='/search'
					className='btn btn--circle btn--search'
					aria-label='search button'
				/>
				<Button
					mod='circle menu'
					aria-label='menu button'
					onClick={switchMenuVisibility}
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
