import { createLazyFileRoute } from '@tanstack/react-router';
import AddItemForm from '../components/item-form';

export const Route = createLazyFileRoute('/edit/$itemId')({
	component: AddItemForm,
});
