import { createLazyFileRoute } from '@tanstack/react-router';
import WordForm from '../components/add-item-form';

export const Route = createLazyFileRoute('/edit/$wordId')({
	// component: EditWordForm,
	component: WordForm,
});

// function EditWordForm() {
// 	const { wordId } = Route.useParams();
// 	return (
// 		<>
// 			<WordForm wordId={wordId} />
// 		</>
// 	);
// }
