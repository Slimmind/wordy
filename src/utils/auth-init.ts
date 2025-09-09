import { getAuth } from 'firebase/auth';
import { store } from '../store/store';
import { setUser, clearError } from '../store/auth';

export const initFirebaseAuth = () => {
	const auth = getAuth();

	// Listen for authentication state changes
	return auth.onAuthStateChanged((user) => {
		if (user) {
			// User is signed in
			store.dispatch(
				setUser({
					uid: user.uid,
					displayName: user.displayName,
					email: user.email,
					photoURL: user.photoURL,
				})
			);
			store.dispatch(clearError());
		} else {
			// User is signed out
			store.dispatch(setUser(null));
		}
	});
};
