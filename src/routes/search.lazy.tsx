import { createLazyFileRoute } from '@tanstack/react-router'
import { Search } from '../components/search/Search'

export const Route = createLazyFileRoute('/search')({
  component: Search
})