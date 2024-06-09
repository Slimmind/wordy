import { createFileRoute } from '@tanstack/react-router';
import LetterNavigation from '../../components/letter-navigation';
import Words from '../../components/words';

export const Route = createFileRoute('/words/')({
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
