import { createLazyFileRoute } from '@tanstack/react-router'
import Search from '../components/search'

export const Route = createLazyFileRoute('/search')({
  component: Search
})