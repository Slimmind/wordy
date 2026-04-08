import { lazy, Suspense, useEffect } from 'react';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { useDispatch } from 'react-redux';
import { listenToItems } from '../store/firebase';
import { AppDispatch } from '../store/store';
import Skeleton from '../components/skeleton';
import { ErrorBoundary } from '../components/error-boundary';

const Layout = lazy(() => import('../components/Layout'));

export const Route = createRootRoute({
	component: () => {
		const RootComponent = () => {
			const dispatch = useDispatch<AppDispatch>();

			// NOTE: This subscribes to the ENTIRE vocabulary collection.
			// For better performance, consider lazy loading by letter/search
			// using services/firestore.ts and useVocabulary() hook.
			useEffect(() => {
				const unsubscribe = dispatch(listenToItems());
				return () => unsubscribe();
			}, [dispatch]);

			return (
				<ErrorBoundary>
					<Suspense fallback={<Skeleton delay={3000} />}>
						<Layout>
							<Suspense fallback={<Skeleton delay={3000} />}>
								<main>
									<Outlet />
								</main>
							</Suspense>
						</Layout>
					</Suspense>
				</ErrorBoundary>
			);
		};

		return <RootComponent />;
	},
});
