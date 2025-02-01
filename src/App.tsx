import { lazy, Suspense } from 'react';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import './App.css';

const router = createRouter({ routeTree });

// Ленивая загрузка компонентов
const Background = lazy(() => import('./components/background'));
const Header = lazy(() => import('./components/header'));
const Footer = lazy(() => import('./components/footer'));

function App() {
	return (
		<>
			<Suspense fallback={<div>Loading...</div>}>
				<Background />
				<Header />
				<main className='main'>
					<RouterProvider router={router} />
				</main>
				<Footer />
			</Suspense>
		</>
	);
}

export default App;
