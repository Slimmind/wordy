import { createLazyFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import Search from '../components/search'
import Skeleton from '../components/skeleton'

export const Route = createLazyFileRoute('/search')({
  component: () => (
    <Suspense fallback={<Skeleton delay={3000} />}>
      <Search />
    </Suspense>
  )
});