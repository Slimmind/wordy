import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/update-profile')({
  component: () => <div>Hello /update-profile!</div>
})