import { lazy, Suspense } from 'react';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import SplashScreen from '../components/splash-screen';

const Layout = lazy(() => import('../components/Layout'));

export const Route = createRootRoute({
	component: () => (
		<Suspense fallback={<SplashScreen />}>
			<Layout>
				<main>
					<Outlet />
				</main>
			</Layout>
		</Suspense>
	),
});
