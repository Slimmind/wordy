import { useState, lazy } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '../../contexts/auth.context';
import './profile.styles.css';

const InternalWindow = lazy(() => import('../internal-window'));
const Block = lazy(() => import('../block'));
const Alert = lazy(() => import('../alert'));
const Button = lazy(() => import('../button'));

export const Profile = () => {
	const [error, setError] = useState<string>('');
	const { currentUser, logout } = useAuth();
	const navigate = useNavigate();

	async function handleLogOut() {
		setError('');
		try {
			await logout();
			navigate({ to: '/' });
		} catch {
			setError('Failed to log out');
		}
	}

	if (error) {
		return (
			<Alert shown={!!error} type='error' title='Error!'>
				{error}
			</Alert>
		);
	}
	return (
		<InternalWindow title='Profile'>
			<Block>
				<strong>Name: </strong>
				{currentUser?.displayName}
			</Block>
			<Block>
				<strong>Email: </strong>
				{currentUser?.email}
			</Block>
			<Button mod='bordered wide' onClick={handleLogOut}>
				Log Out
			</Button>
		</InternalWindow>
	);
};
