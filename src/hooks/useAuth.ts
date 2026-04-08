import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';
import {
	login,
	signup,
	loginWithGoogle,
	logout,
	clearError,
} from '../store/auth';
import type { AuthUser } from '../schemas/auth.schema';

/**
 * Hook for authentication state and actions.
 * Use this instead of direct Redux access.
 */
export function useAuth() {
	const dispatch = useDispatch<AppDispatch>();
	const currentUser = useSelector((state: RootState) => state.auth.currentUser);
	const loading = useSelector((state: RootState) => state.auth.loading);
	const error = useSelector((state: RootState) => state.auth.error);

	const handleLogin = (email: string, password: string) => {
		dispatch(login({ email, password }));
	};

	const handleSignup = (name: string, email: string, password: string) => {
		dispatch(signup({ name, email, password }));
	};

	const handleGoogleLogin = () => {
		dispatch(loginWithGoogle());
	};

	const handleLogout = () => {
		dispatch(logout());
	};

	const handleClearError = () => {
		dispatch(clearError());
	};

	return {
		user: currentUser as AuthUser | null,
		loading,
		error,
		login: handleLogin,
		signup: handleSignup,
		loginWithGoogle: handleGoogleLogin,
		logout: handleLogout,
		clearError: handleClearError,
		isAuthenticated: currentUser !== null,
		userId: currentUser?.uid ?? null,
	};
}
