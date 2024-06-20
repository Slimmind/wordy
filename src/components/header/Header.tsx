// import { useMemo } from 'react';
// import { useFirestore } from '../../contexts/firestore.context';
import { useAuth } from '../../contexts/auth.context';
import { Link } from '@tanstack/react-router';
import './header.styles.css';

export const Header = () => {
	// const { words } = useFirestore();
	const { currentUser } = useAuth();
	console.log('CURR_USER: ', currentUser);
	// const wordsAmount = useMemo(() => words.length, [words]);
	return (
		<header className='main-header'>
			<Link to='/'>
				<h1 className='main-header__logo'>FoxyWord</h1>
			</Link>
			{/* <strong className='main-header__word-amount'>Words: {wordsAmount}</strong> */}
			<div className='main-header__auth'>
				{currentUser?.email ? (
					<Link to='/profile' className='btn btn--circle btn--profile'></Link>
				) : (
					<Link to='/login'>Sign In</Link>
				)}
			</div>
		</header>
	);
};
