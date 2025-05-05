import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/add-item/$searchQuery')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/add-item/$searchQuery"!</div>
}
