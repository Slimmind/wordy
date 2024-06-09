import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import Header from '../components/header'
import Footer from '../components/footer'

export const Route = createRootRoute({
  component: () => (
    <>
      <Header />
      <main>
        <Outlet/>
        <TanStackRouterDevtools />
      </main>
      <Footer />
    </>
  ),
});
