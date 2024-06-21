import { createRootRoute, Outlet } from '@tanstack/react-router';
import Layout from '../components/Layout';
// import { TanStackRouterDevtools } from '@tanstack/router-devtools';

export const Route = createRootRoute({
	component: () => (
		<Layout>
			<main>
				<Outlet />
				{/* <TanStackRouterDevtools /> */}
			</main>
		</Layout>
	),
});
