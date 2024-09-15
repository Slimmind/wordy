import { lazy } from 'react';
import { createRootRoute, Outlet } from '@tanstack/react-router';

const Layout = lazy(() => import('../components/Layout'));

export const Route = createRootRoute({
	component: () => (
		<Layout>
			<main>
				<Outlet />
			</main>
		</Layout>
	),
});
