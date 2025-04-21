import { lazy, Suspense } from 'react';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import Skeleton from '../components/skeleton';

const Layout = lazy(() => import('../components/Layout'));

export const Route = createRootRoute({
	component: () => (
		<Suspense fallback={<Skeleton delay={3000} />}>
			<Layout>
				<Suspense fallback={<Skeleton delay={3000} />}>
					<main>
						<Outlet />
					</main>
				</Suspense>
			</Layout>
		</Suspense>
	),
});
