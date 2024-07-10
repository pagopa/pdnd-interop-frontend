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
import '@/index.css'

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
  defaultErrorComponent: ErrorComponent,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

declare module '@tanstack/react-router' {
  interface StaticDataRouteOption {
    authLevels: Array<UserProductRole>
    routeKey: string
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
