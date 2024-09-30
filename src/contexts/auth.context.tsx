import {
	createContext,
	useContext,
	useState,
	useEffect,
	PropsWithChildren,
} from 'react';
import { auth } from '../firebase';
import {
	GoogleAuthProvider,
	signInWithPopup,
	createUserWithEmailAndPassword,
	updateProfile,
	signInWithEmailAndPassword,
	signOut,
	User,
	UserCredential,
} from 'firebase/auth';

// Create a type for the auth context data
type AuthContextType = {
	currentUser: User | null;
	login: (email: string, password: string) => Promise<UserCredential>;
	signup: (
		name: string,
		email: string,
		password: string
	) => Promise<UserCredential>;
	loginWithGoogle: () => Promise<UserCredential>;
	logout: () => Promise<void>;
};

// Create the context
const AuthContext = createContext<AuthContextType>(null!);

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Auth provider component
export const AuthProvider = ({ children }: PropsWithChildren) => {
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((user) => {
			setCurrentUser(user);
			setLoading(false);
		});

		return unsubscribe;
	}, []);

	const signup = async (name: string, email: string, password: string) => {
		try {
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			const user = userCredential.user;

			if (user) {
				await updateProfile(user, {
					displayName: name,
				});
				console.log('User profile updated with displayName:', name);
			}

			return userCredential;
		} catch (error) {
			console.error('Error during sign up:', error);
			throw error;
		}
	};

	const login = (email: string, password: string) => {
		return signInWithEmailAndPassword(auth, email, password);
	};

	const loginWithGoogle = () => {
		const provider = new GoogleAuthProvider();
		return signInWithPopup(auth, provider);
	};

	const logout = () => {
		return signOut(auth);
	};

	const value = {
		currentUser,
		login,
		signup,
		loginWithGoogle,
		logout,
	};

	return (
		<AuthContext.Provider value={value}>
			{!loading && children}
		</AuthContext.Provider>
	);
};
