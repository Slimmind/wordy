import { useEffect } from 'react';
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import { store } from '../store/store';
import Profile from '../components/profile';

export const Route = createLazyFileRoute('/profile')({
	component: ProfileGuarded,
});

function ProfileGuarded() {
	const navigate = useNavigate();

	useEffect(() => {
		const state = store.getState();
		if (!state.auth.currentUser) {
			navigate({ to: '/login', replace: true });
		}
	}, [navigate]);

	return <Profile />;
}
