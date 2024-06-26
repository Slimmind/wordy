import { useState } from 'react';
import { useAuth } from '../../contexts/auth.context';
import { Link } from '@tanstack/react-router';
import { Button } from '../button/Button';
import './footer.styles.css';
import MainMenu from '../main-menu';
import Block from '../block';

export const Footer = () => {
	const { currentUser } = useAuth();
	const [isMenuOpened, setIsMenuOpened] = useState<boolean>(false);

	function switchMenuVisibility(): void {
		setIsMenuOpened(!isMenuOpened);
	}
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
						to='/add-word'
						className='btn btn--circle btn--add'
						aria-label='add word button'
					/>
				)}
			</Block>
		</footer>
	);
};
