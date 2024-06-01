/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as IndexImport } from './routes/index'

// Create Virtual Routes

const SearchLazyImport = createFileRoute('/search')()
const RegisterLazyImport = createFileRoute('/register')()
const PhrasesLazyImport = createFileRoute('/phrases')()
const LoginLazyImport = createFileRoute('/login')()
const AddWordLazyImport = createFileRoute('/add-word')()

// Create/Update Routes

const SearchLazyRoute = SearchLazyImport.update({
  path: '/search',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/search.lazy').then((d) => d.Route))

const RegisterLazyRoute = RegisterLazyImport.update({
  path: '/register',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/register.lazy').then((d) => d.Route))

const PhrasesLazyRoute = PhrasesLazyImport.update({
  path: '/phrases',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/phrases.lazy').then((d) => d.Route))

const LoginLazyRoute = LoginLazyImport.update({
  path: '/login',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/login.lazy').then((d) => d.Route))

const AddWordLazyRoute = AddWordLazyImport.update({
  path: '/add-word',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/add-word.lazy').then((d) => d.Route))

const IndexRoute = IndexImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/add-word': {
      preLoaderRoute: typeof AddWordLazyImport
      parentRoute: typeof rootRoute
    }
    '/login': {
      preLoaderRoute: typeof LoginLazyImport
      parentRoute: typeof rootRoute
    }
    '/phrases': {
      preLoaderRoute: typeof PhrasesLazyImport
      parentRoute: typeof rootRoute
    }
    '/register': {
      preLoaderRoute: typeof RegisterLazyImport
      parentRoute: typeof rootRoute
    }
    '/search': {
      preLoaderRoute: typeof SearchLazyImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren([
  IndexRoute,
  AddWordLazyRoute,
  LoginLazyRoute,
  PhrasesLazyRoute,
  RegisterLazyRoute,
  SearchLazyRoute,
])

/* prettier-ignore-end */
