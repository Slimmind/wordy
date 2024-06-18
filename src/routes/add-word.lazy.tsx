import { createLazyFileRoute } from '@tanstack/react-router';
import WordForm from '../components/word-form';

export const Route = createLazyFileRoute('/add-word')({
	component: WordForm,
});
