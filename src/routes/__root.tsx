import { lazy, Suspense, useEffect } from 'react';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { useDispatch } from 'react-redux';
import { listenToItems } from '../store/firebase';
import { AppDispatch } from '../store/store';
import Skeleton from '../components/skeleton';

const Layout = lazy(() => import('../components/Layout'));

export const Route = createRootRoute({
	component: () => {
		const RootComponent = () => {
			const dispatch = useDispatch<AppDispatch>();
			
			useEffect(() => {
				const unsubscribe = dispatch(listenToItems());
				return () => unsubscribe();
			}, [dispatch]);
			
			return (
				<Suspense fallback={<Skeleton delay={3000} />}>
					<Layout>
						<Suspense fallback={<Skeleton delay={3000} />}>
							<main>
								<Outlet />
							</main>
						</Suspense>
					</Layout>
				</Suspense>
			);
		};
		
		return <RootComponent />;
	},
});
