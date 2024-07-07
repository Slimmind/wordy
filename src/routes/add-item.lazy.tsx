import { createLazyFileRoute } from '@tanstack/react-router';
import AddItemForm from '../components/add-item-form';

export const Route = createLazyFileRoute('/add-item')({
	component: AddItemForm,
});
