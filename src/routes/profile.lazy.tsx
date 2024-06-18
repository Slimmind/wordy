import { createLazyFileRoute } from '@tanstack/react-router'
import Profile from '../components/profile'

export const Route = createLazyFileRoute('/profile')({
  component: Profile
})