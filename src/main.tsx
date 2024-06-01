import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';

import { routeTree } from './routeTree.gen';
import './index.css';
import { FirestoreProvider } from './contexts/firestore.context';
import { AuthProvider } from './contexts/auth.context';

const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router;
	}
}

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<AuthProvider>
			<FirestoreProvider>
				<RouterProvider router={router} />
			</FirestoreProvider>
		</AuthProvider>
	</React.StrictMode>
);
