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

const UpdateProfileLazyImport = createFileRoute('/update-profile')()
const SignupLazyImport = createFileRoute('/signup')()
const SearchLazyImport = createFileRoute('/search')()
const ProfileLazyImport = createFileRoute('/profile')()
const PhrasesLazyImport = createFileRoute('/phrases')()
const LoginLazyImport = createFileRoute('/login')()
const AddItemLazyImport = createFileRoute('/add-item')()
const OwnCollectionIndexLazyImport = createFileRoute('/own-collection/')()
const ItemsIndexLazyImport = createFileRoute('/items/')()
const OwnCollectionUserIdLazyImport = createFileRoute(
  '/own-collection/$userId',
)()
const ItemsItemIdLazyImport = createFileRoute('/items/$itemId')()
const EditItemIdLazyImport = createFileRoute('/edit/$itemId')()

// Create/Update Routes

const UpdateProfileLazyRoute = UpdateProfileLazyImport.update({
  path: '/update-profile',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/update-profile.lazy').then((d) => d.Route),
)

const SignupLazyRoute = SignupLazyImport.update({
  path: '/signup',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/signup.lazy').then((d) => d.Route))

const SearchLazyRoute = SearchLazyImport.update({
  path: '/search',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/search.lazy').then((d) => d.Route))

const ProfileLazyRoute = ProfileLazyImport.update({
  path: '/profile',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/profile.lazy').then((d) => d.Route))

const PhrasesLazyRoute = PhrasesLazyImport.update({
  path: '/phrases',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/phrases.lazy').then((d) => d.Route))

const LoginLazyRoute = LoginLazyImport.update({
  path: '/login',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/login.lazy').then((d) => d.Route))

const AddItemLazyRoute = AddItemLazyImport.update({
  path: '/add-item',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/add-item.lazy').then((d) => d.Route))

const IndexRoute = IndexImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const OwnCollectionIndexLazyRoute = OwnCollectionIndexLazyImport.update({
  path: '/own-collection/',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/own-collection/index.lazy').then((d) => d.Route),
)

const ItemsIndexLazyRoute = ItemsIndexLazyImport.update({
  path: '/items/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/items/index.lazy').then((d) => d.Route))

const OwnCollectionUserIdLazyRoute = OwnCollectionUserIdLazyImport.update({
  path: '/own-collection/$userId',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/own-collection/$userId.lazy').then((d) => d.Route),
)

const ItemsItemIdLazyRoute = ItemsItemIdLazyImport.update({
  path: '/items/$itemId',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/items/$itemId.lazy').then((d) => d.Route))

const EditItemIdLazyRoute = EditItemIdLazyImport.update({
  path: '/edit/$itemId',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/edit.$itemId.lazy').then((d) => d.Route))

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/add-item': {
      id: '/add-item'
      path: '/add-item'
      fullPath: '/add-item'
      preLoaderRoute: typeof AddItemLazyImport
      parentRoute: typeof rootRoute
    }
    '/login': {
      id: '/login'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof LoginLazyImport
      parentRoute: typeof rootRoute
    }
    '/phrases': {
      id: '/phrases'
      path: '/phrases'
      fullPath: '/phrases'
      preLoaderRoute: typeof PhrasesLazyImport
      parentRoute: typeof rootRoute
    }
    '/profile': {
      id: '/profile'
      path: '/profile'
      fullPath: '/profile'
      preLoaderRoute: typeof ProfileLazyImport
      parentRoute: typeof rootRoute
    }
    '/search': {
      id: '/search'
      path: '/search'
      fullPath: '/search'
      preLoaderRoute: typeof SearchLazyImport
      parentRoute: typeof rootRoute
    }
    '/signup': {
      id: '/signup'
      path: '/signup'
      fullPath: '/signup'
      preLoaderRoute: typeof SignupLazyImport
      parentRoute: typeof rootRoute
    }
    '/update-profile': {
      id: '/update-profile'
      path: '/update-profile'
      fullPath: '/update-profile'
      preLoaderRoute: typeof UpdateProfileLazyImport
      parentRoute: typeof rootRoute
    }
    '/edit/$itemId': {
      id: '/edit/$itemId'
      path: '/edit/$itemId'
      fullPath: '/edit/$itemId'
      preLoaderRoute: typeof EditItemIdLazyImport
      parentRoute: typeof rootRoute
    }
    '/items/$itemId': {
      id: '/items/$itemId'
      path: '/items/$itemId'
      fullPath: '/items/$itemId'
      preLoaderRoute: typeof ItemsItemIdLazyImport
      parentRoute: typeof rootRoute
    }
    '/own-collection/$userId': {
      id: '/own-collection/$userId'
      path: '/own-collection/$userId'
      fullPath: '/own-collection/$userId'
      preLoaderRoute: typeof OwnCollectionUserIdLazyImport
      parentRoute: typeof rootRoute
    }
    '/items/': {
      id: '/items/'
      path: '/items'
      fullPath: '/items'
      preLoaderRoute: typeof ItemsIndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/own-collection/': {
      id: '/own-collection/'
      path: '/own-collection'
      fullPath: '/own-collection'
      preLoaderRoute: typeof OwnCollectionIndexLazyImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren({
  IndexRoute,
  AddItemLazyRoute,
  LoginLazyRoute,
  PhrasesLazyRoute,
  ProfileLazyRoute,
  SearchLazyRoute,
  SignupLazyRoute,
  UpdateProfileLazyRoute,
  EditItemIdLazyRoute,
  ItemsItemIdLazyRoute,
  OwnCollectionUserIdLazyRoute,
  ItemsIndexLazyRoute,
  OwnCollectionIndexLazyRoute,
})

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/add-item",
        "/login",
        "/phrases",
        "/profile",
        "/search",
        "/signup",
        "/update-profile",
        "/edit/$itemId",
        "/items/$itemId",
        "/own-collection/$userId",
        "/items/",
        "/own-collection/"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/add-item": {
      "filePath": "add-item.lazy.tsx"
    },
    "/login": {
      "filePath": "login.lazy.tsx"
    },
    "/phrases": {
      "filePath": "phrases.lazy.tsx"
    },
    "/profile": {
      "filePath": "profile.lazy.tsx"
    },
    "/search": {
      "filePath": "search.lazy.tsx"
    },
    "/signup": {
      "filePath": "signup.lazy.tsx"
    },
    "/update-profile": {
      "filePath": "update-profile.lazy.tsx"
    },
    "/edit/$itemId": {
      "filePath": "edit.$itemId.lazy.tsx"
    },
    "/items/$itemId": {
      "filePath": "items/$itemId.lazy.tsx"
    },
    "/own-collection/$userId": {
      "filePath": "own-collection/$userId.lazy.tsx"
    },
    "/items/": {
      "filePath": "items/index.lazy.tsx"
    },
    "/own-collection/": {
      "filePath": "own-collection/index.lazy.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
