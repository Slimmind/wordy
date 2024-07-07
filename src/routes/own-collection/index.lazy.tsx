import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/own-collection/')({
  component: () => <div>Hello /own-collection/!</div>
})