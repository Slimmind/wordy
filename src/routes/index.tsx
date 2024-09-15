import { lazy } from 'react';
import { createFileRoute } from '@tanstack/react-router';
// import LetterNavigation from '../components/letter-navigation';
// import Words from '../components/words';

const LetterNavigation = lazy(() => import('../components/letter-navigation'));
const Words = lazy(() => import('../components/words'));

export const Route = createFileRoute('/')({
	component: Index,
});

function Index() {
	return (
		<>
			<LetterNavigation />
			<Words />
		</>
	);
}
