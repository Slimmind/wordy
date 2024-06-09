// import { useMemo } from 'react';
// import { useFirestore } from '../../contexts/firestore.context';
import { useAuth } from '../../contexts/auth.context';
import { Link } from '@tanstack/react-router';
import './header.styles.css';

export const Header = () => {
	// const { words } = useFirestore();
	const { currentUser } = useAuth();
	// const wordsAmount = useMemo(() => words.length, [words]);
	return (
		<header className='main-header'>
			<h1>Wordy</h1>
			{/* <strong className='main-header__word-amount'>Words: {wordsAmount}</strong> */}
			{currentUser?.email ? (
				<Link to='/profile' className='btn btn--circle btn--profile'></Link>
			) : (
				<Link to='/login'>Sign In</Link>
			)}
		</header>
	);
};
