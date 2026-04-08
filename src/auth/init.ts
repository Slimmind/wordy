/**
 * Firebase Auth initialization.
 * Returns an unsubscribe function for cleanup.
 */
import { getAuth } from 'firebase/auth';
import { store } from '../store/store';
import { setUser, clearError } from '../store/auth';

export function initFirebaseAuth(): () => void {
	const auth = getAuth();

	const unsubscribe = auth.onAuthStateChanged((user) => {
		if (user) {
			store.dispatch(
				setUser({
					uid: user.uid,
					displayName: user.displayName ?? null,
					email: user.email,
					photoURL: user.photoURL ?? null,
				}),
			);
			store.dispatch(clearError());
		} else {
			store.dispatch(setUser(null));
		}
	});

	return unsubscribe;
}

/**
 * Check if user is currently authenticated (synchronous, reads from Redux).
 */
export function isAuthenticated(): boolean {
	const state = store.getState();
	return state.auth.currentUser !== null;
}

/**
 * Get current user ID from Redux state.
 */
export function getCurrentUserId(): string | null {
	const state = store.getState();
	return state.auth.currentUser?.uid ?? null;
}
