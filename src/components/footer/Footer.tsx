import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Button } from '../button/Button';
import './footer.styles.css';
import MainMenu from '../main-menu';

export const Footer = () => {
	const [isMenuOpened, setIsMenuOpened] = useState<boolean>(false);

	function switchMenuVisibility(): void {
		setIsMenuOpened(!isMenuOpened);
	}
	return (
		<footer className='main-footer'>
			<MainMenu visibility={isMenuOpened} />
			<Link
				to='/search'
				className='btn btn--circle btn--search'
				aria-label='search button'
			/>
			<Button
				mod='btn--circle btn--menu'
				aria-label='menu button'
				onClick={switchMenuVisibility}
			/>
			<Link
				to='/add-word'
				className='btn btn--circle btn--add'
				aria-label='add word button'
			/>
		</footer>
	);
};
