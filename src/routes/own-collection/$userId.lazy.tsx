import { createLazyFileRoute } from '@tanstack/react-router';
import LetterNavigation from '../../components/letter-navigation';
import Words from '../../components/words';

export const Route = createLazyFileRoute('/own-collection/$userId')({
	component: Collection,
});

function Collection() {
	const { userId } = Route.useParams();
	return (
		<>
			<LetterNavigation userId={userId} />
			<Words userId={userId} />
		</>
	);
}
