import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from './routeTree.gen'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './config/query-client'
import i18n from './config/react-i18next'
import { DEFAULT_LANG, LANGUAGES } from './config/constants'
import type { UserProductRole } from './types/party.types'
import { ErrorComponent } from './components/shared/ErrorComponent'

const url = window.location.pathname
const pathsSegments = url
  .split('/')
  .filter(Boolean)
  .filter((s) => s !== 'ui')

const currentLang = Object.keys(LANGUAGES).includes(pathsSegments[0])
  ? `${pathsSegments[0]}`
  : `${DEFAULT_LANG}`

const basepath = `/${currentLang}`
i18n.changeLanguage(currentLang)

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  basepath,
  defaultPreload: 'intent',
  // Since we're using React Query, we don't want loader calls to ever be stale
  // This will ensure that the loader is always called when the route is preloaded or visited
  defaultPreloadStaleTime: 0,
  defaultErrorComponent: ErrorComponent,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

declare module '@tanstack/react-router' {
  interface StaticDataRouteOption {
    authLevels?: Array<UserProductRole>
    hideSideNav?: boolean
  }
}

// Render the app
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>
  )
}
