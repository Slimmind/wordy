import { useMemo } from 'react';
import { useFirestore } from '../../contexts/firestore.context';
import './header.styles.css';

export const Header = () => {
	const { words } = useFirestore();
	const wordsAmount = useMemo(() => words.length, [words]);
	return (
		<header className='main-header'>
			<h1>Wordy</h1>
			<strong className='main-header__word-amount'>Words: {wordsAmount}</strong>
		</header>
	);
};
