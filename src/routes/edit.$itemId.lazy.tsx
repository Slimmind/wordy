import { useEffect } from 'react';
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import { store } from '../store/store';
import AddItemForm from '../components/item-form';

export const Route = createLazyFileRoute('/edit/$itemId')({
	component: EditItemGuarded,
});

function EditItemGuarded() {
	const navigate = useNavigate();

	useEffect(() => {
		const state = store.getState();
		if (!state.auth.currentUser) {
			navigate({ to: '/login', replace: true });
		}
	}, [navigate]);

	return <AddItemForm />;
}
