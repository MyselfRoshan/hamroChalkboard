/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as RegisterImport } from './routes/register'
import { Route as LoginImport } from './routes/login'
import { Route as authDashboardImport } from './routes/(auth)/dashboard'
import { Route as authBallImport } from './routes/(auth)/ball'

// Create Virtual Routes

const FeaturesLazyImport = createFileRoute('/features')()
const DrawLazyImport = createFileRoute('/draw')()
const ContactLazyImport = createFileRoute('/contact')()
const AboutLazyImport = createFileRoute('/about')()
const IndexLazyImport = createFileRoute('/')()

// Create/Update Routes

const FeaturesLazyRoute = FeaturesLazyImport.update({
  path: '/features',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/features.lazy').then((d) => d.Route))

const DrawLazyRoute = DrawLazyImport.update({
  path: '/draw',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/draw.lazy').then((d) => d.Route))

const ContactLazyRoute = ContactLazyImport.update({
  path: '/contact',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/contact.lazy').then((d) => d.Route))

const AboutLazyRoute = AboutLazyImport.update({
  path: '/about',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/about.lazy').then((d) => d.Route))

const RegisterRoute = RegisterImport.update({
  path: '/register',
  getParentRoute: () => rootRoute,
} as any)

const LoginRoute = LoginImport.update({
  path: '/login',
  getParentRoute: () => rootRoute,
} as any)

const IndexLazyRoute = IndexLazyImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/index.lazy').then((d) => d.Route))

const authDashboardRoute = authDashboardImport.update({
  path: '/dashboard',
  getParentRoute: () => rootRoute,
} as any)

const authBallRoute = authBallImport.update({
  path: '/ball',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/login': {
      id: '/login'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof LoginImport
      parentRoute: typeof rootRoute
    }
    '/register': {
      id: '/register'
      path: '/register'
      fullPath: '/register'
      preLoaderRoute: typeof RegisterImport
      parentRoute: typeof rootRoute
    }
    '/about': {
      id: '/about'
      path: '/about'
      fullPath: '/about'
      preLoaderRoute: typeof AboutLazyImport
      parentRoute: typeof rootRoute
    }
    '/contact': {
      id: '/contact'
      path: '/contact'
      fullPath: '/contact'
      preLoaderRoute: typeof ContactLazyImport
      parentRoute: typeof rootRoute
    }
    '/draw': {
      id: '/draw'
      path: '/draw'
      fullPath: '/draw'
      preLoaderRoute: typeof DrawLazyImport
      parentRoute: typeof rootRoute
    }
    '/features': {
      id: '/features'
      path: '/features'
      fullPath: '/features'
      preLoaderRoute: typeof FeaturesLazyImport
      parentRoute: typeof rootRoute
    }
    '/(auth)/ball': {
      id: '/ball'
      path: '/ball'
      fullPath: '/ball'
      preLoaderRoute: typeof authBallImport
      parentRoute: typeof rootRoute
    }
    '/(auth)/dashboard': {
      id: '/dashboard'
      path: '/dashboard'
      fullPath: '/dashboard'
      preLoaderRoute: typeof authDashboardImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexLazyRoute
  '/login': typeof LoginRoute
  '/register': typeof RegisterRoute
  '/about': typeof AboutLazyRoute
  '/contact': typeof ContactLazyRoute
  '/draw': typeof DrawLazyRoute
  '/features': typeof FeaturesLazyRoute
  '/ball': typeof authBallRoute
  '/dashboard': typeof authDashboardRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexLazyRoute
  '/login': typeof LoginRoute
  '/register': typeof RegisterRoute
  '/about': typeof AboutLazyRoute
  '/contact': typeof ContactLazyRoute
  '/draw': typeof DrawLazyRoute
  '/features': typeof FeaturesLazyRoute
  '/ball': typeof authBallRoute
  '/dashboard': typeof authDashboardRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexLazyRoute
  '/login': typeof LoginRoute
  '/register': typeof RegisterRoute
  '/about': typeof AboutLazyRoute
  '/contact': typeof ContactLazyRoute
  '/draw': typeof DrawLazyRoute
  '/features': typeof FeaturesLazyRoute
  '/ball': typeof authBallRoute
  '/dashboard': typeof authDashboardRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/login'
    | '/register'
    | '/about'
    | '/contact'
    | '/draw'
    | '/features'
    | '/ball'
    | '/dashboard'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/login'
    | '/register'
    | '/about'
    | '/contact'
    | '/draw'
    | '/features'
    | '/ball'
    | '/dashboard'
  id:
    | '__root__'
    | '/'
    | '/login'
    | '/register'
    | '/about'
    | '/contact'
    | '/draw'
    | '/features'
    | '/ball'
    | '/dashboard'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexLazyRoute: typeof IndexLazyRoute
  LoginRoute: typeof LoginRoute
  RegisterRoute: typeof RegisterRoute
  AboutLazyRoute: typeof AboutLazyRoute
  ContactLazyRoute: typeof ContactLazyRoute
  DrawLazyRoute: typeof DrawLazyRoute
  FeaturesLazyRoute: typeof FeaturesLazyRoute
  authBallRoute: typeof authBallRoute
  authDashboardRoute: typeof authDashboardRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexLazyRoute: IndexLazyRoute,
  LoginRoute: LoginRoute,
  RegisterRoute: RegisterRoute,
  AboutLazyRoute: AboutLazyRoute,
  ContactLazyRoute: ContactLazyRoute,
  DrawLazyRoute: DrawLazyRoute,
  FeaturesLazyRoute: FeaturesLazyRoute,
  authBallRoute: authBallRoute,
  authDashboardRoute: authDashboardRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/login",
        "/register",
        "/about",
        "/contact",
        "/draw",
        "/features",
        "/ball",
        "/dashboard"
      ]
    },
    "/": {
      "filePath": "index.lazy.tsx"
    },
    "/login": {
      "filePath": "login.tsx"
    },
    "/register": {
      "filePath": "register.tsx"
    },
    "/about": {
      "filePath": "about.lazy.tsx"
    },
    "/contact": {
      "filePath": "contact.lazy.tsx"
    },
    "/draw": {
      "filePath": "draw.lazy.tsx"
    },
    "/features": {
      "filePath": "features.lazy.tsx"
    },
    "/ball": {
      "filePath": "(auth)/ball.tsx"
    },
    "/dashboard": {
      "filePath": "(auth)/dashboard.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
