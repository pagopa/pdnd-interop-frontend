import React from 'react'
import ReactDOM from 'react-dom/client'
import { theme } from '@pagopa/interop-fe-commons'
import { ThemeProvider } from '@mui/material'
import { RouterProvider, createRouter } from '@tanstack/react-router'

import { routeTree } from './routeTree.gen'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './config/query-client'
import i18n from './config/react-i18next'
import { DEFAULT_LANG, LANGUAGES } from './config/constants'
import type { UserProductRole } from './types/party.types'
import { ErrorComponent } from './components/shared/ErrorComponent'
import '@/index.css'
import { AuthProvider, useAuth } from './stores'
import { NotFoundComponent } from './components/shared/NotFoundComponent'

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

const router = createRouter({
  routeTree,
  context: {
    queryClient,
    auth: undefined!,
  },
  basepath,
  defaultPreload: 'intent',
  defaultErrorComponent: ErrorComponent,
  defaultNotFoundComponent: NotFoundComponent,
  notFoundMode: 'fuzzy',
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
  interface StaticDataRouteOption {
    authLevels: Array<UserProductRole>
    routeKey: string
    hideSideNav?: boolean
  }
  interface HistoryState {
    stepIndexDestination: number
  }
}

function App() {
  const auth = useAuth()
  return <RouterProvider router={router} context={{ auth }} />
}

const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <App />
          </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </React.StrictMode>
  )
}
