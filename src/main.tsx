import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { Provider } from 'react-redux';
import { store } from './store/store';
import './index.css';
import { initFirebaseAuth } from './auth/init';

if ('serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		navigator.serviceWorker.register('/sw.js').catch((registrationError) => {
			console.error('SW registration failed: ', registrationError);
		});
	});
}

const router = createRouter({ routeTree });

// Initialize Firebase authentication state
const unsubscribeAuthListener = initFirebaseAuth();

// Clean up the listener when the app unmounts
window.addEventListener('beforeunload', () => {
	if (unsubscribeAuthListener) {
		unsubscribeAuthListener();
	}
});

declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router;
	}
}

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<Provider store={store}>
			<RouterProvider router={router} />
		</Provider>
	</React.StrictMode>,
);
