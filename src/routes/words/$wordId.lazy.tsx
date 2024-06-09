import { createFileRoute } from '@tanstack/react-router';
import WordDetails from '../../components/word-details';

export const Route = createFileRoute('/words/$wordId')({
	component: WordDetails,
});
