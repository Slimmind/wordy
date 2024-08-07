import { createLazyFileRoute } from '@tanstack/react-router';
import OwnCollection from '../../components/own-collection';

export const Route = createLazyFileRoute('/own-collection/$userId')({
	component: Collection,
});

function Collection() {
	const { userId } = Route.useParams();
	return (
		<>
			<OwnCollection userId={userId} />
		</>
	);
}
