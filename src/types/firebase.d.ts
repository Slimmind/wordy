declare module 'firebase/auth' {
	export interface SimpleUser {
		uid: string;
		email: string;
	}

	export interface User extends SimpleUser {
		displayName: string | null;
		photoURL: string | null;
		updateProfile(profile: {
			displayName?: string | null;
			photoURL?: string | null;
		}): Promise<void>;
	}

	export interface Auth {
		currentUser: User | null;
		onAuthStateChanged(callback: (user: User | null) => void): () => void;
		signInWithEmailAndPassword(
			email: string,
			password: string
		): Promise<UserCredential>;
		createUserWithEmailAndPassword(
			email: string,
			password: string
		): Promise<UserCredential>;
		signInWithPopup(provider: AuthProvider): Promise<UserCredential>;
		signOut(): Promise<void>;
	}

	export interface UserCredential {
		user: User;
	}

	export interface AuthProvider {
		providerId: string;
	}

	export class GoogleAuthProvider implements AuthProvider {
		providerId: string;
		constructor();
		setCustomParameters(
			params: Record<string, string | number | boolean>
		): GoogleAuthProvider;
	}

	export function getAuth(): Auth;
	export function signInWithPopup(
		auth: Auth,
		provider: AuthProvider
	): Promise<UserCredential>;
	export function createUserWithEmailAndPassword(
		auth: Auth,
		email: string,
		password: string
	): Promise<UserCredential>;
	export function signInWithEmailAndPassword(
		auth: Auth,
		email: string,
		password: string
	): Promise<UserCredential>;
	export function updateProfile(
		user: User,
		profile: { displayName?: string | null; photoURL?: string | null }
	): Promise<void>;
	export function signOut(auth: Auth): Promise<void>;
}
