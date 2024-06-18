import { createLazyFileRoute } from '@tanstack/react-router';
import WordDetails from '../../components/word-details';

export const Route = createLazyFileRoute('/words/$wordId')({
	component: WordDetails,
});
