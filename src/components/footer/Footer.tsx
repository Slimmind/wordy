import { useAuth } from '../../contexts/auth.context';
import { Link } from '@tanstack/react-router';
import MainMenu from '../main-menu';
import Block from '../block';
import './footer.styles.css';

export const Footer = () => {
	const { currentUser } = useAuth();

	return (
		<footer className='main-footer'>
			<Block>
				<Link
					to='/search'
					className='btn btn--circle btn--search'
					aria-label='search button'
				/>
				<MainMenu />
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
