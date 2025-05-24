import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { auth } from '../firebase';
import {
	GoogleAuthProvider,
	signInWithPopup,
	createUserWithEmailAndPassword,
	updateProfile,
	signInWithEmailAndPassword,
	signOut,
	SimpleUser,
} from 'firebase/auth';

// Тип для того, что мы храним в Redux
export interface AuthUser extends SimpleUser {
	uid: string;
	displayName: string | null;
	photoURL: string | null;
}

interface AuthState {
	currentUser: AuthUser | null;
	loading: boolean;
	error: string | null;
}

const initialState: AuthState = {
	currentUser: null,
	loading: true,
	error: null,
};

// Thunks

export const signup = createAsyncThunk(
	'auth/signup',
	async (
		{
			name,
			email,
			password,
		}: { name: string; email: string; password: string },
		thunkAPI
	) => {
		try {
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			const user = userCredential.user;

			if (user) {
				await updateProfile(user, { displayName: name });
			}

			return {
				uid: user.uid,
				displayName: user.displayName,
				email: user.email,
				photoURL: user.photoURL,
			};
		} catch (error) {
			return thunkAPI.rejectWithValue(
				error instanceof Error ? error.message : 'Signup failed'
			);
		}
	}
);

export const login = createAsyncThunk(
	'auth/login',
	async (
		{ email, password }: { email: string; password: string },
		thunkAPI
	) => {
		try {
			const userCredential = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);
			const user = userCredential.user;

			return {
				uid: user.uid,
				displayName: user.displayName,
				email: user.email,
				photoURL: user.photoURL,
			};
		} catch (error) {
			return thunkAPI.rejectWithValue(
				error instanceof Error ? error.message : 'Login failed'
			);
		}
	}
);

export const loginWithGoogle = createAsyncThunk(
	'auth/loginWithGoogle',
	async (_, thunkAPI) => {
		try {
			const provider = new GoogleAuthProvider();
			const result = await signInWithPopup(auth, provider);
			const user = result.user;

			return {
				uid: user.uid,
				displayName: user.displayName,
				email: user.email,
				photoURL: user.photoURL,
			};
		} catch (error) {
			return thunkAPI.rejectWithValue(
				error instanceof Error ? error.message : 'Google login failed'
			);
		}
	}
);

export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
	try {
		await signOut(auth);
	} catch (error) {
		return thunkAPI.rejectWithValue(
			error instanceof Error ? error.message : 'Logout failed'
		);
	}
});

// Slice

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setUser: (state, action: PayloadAction<AuthUser | null>) => {
			state.currentUser = action.payload;
		},
		clearError: (state) => {
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(signup.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(signup.fulfilled, (state, action) => {
				state.currentUser = action.payload;
				state.loading = false;
			})
			.addCase(signup.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			})

			.addCase(login.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(login.fulfilled, (state, action) => {
				state.currentUser = action.payload;
				state.loading = false;
			})
			.addCase(login.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			})

			.addCase(loginWithGoogle.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(loginWithGoogle.fulfilled, (state, action) => {
				state.currentUser = action.payload;
				state.loading = false;
			})
			.addCase(loginWithGoogle.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			})

			.addCase(logout.pending, (state) => {
				state.loading = true;
			})
			.addCase(logout.fulfilled, (state) => {
				state.currentUser = null;
				state.loading = false;
			})
			.addCase(logout.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			});
	},
});

export const { setUser, clearError } = authSlice.actions;

export default authSlice.reducer;
