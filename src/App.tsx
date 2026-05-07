import React from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material'
import { RouterProvider } from '@/router'
import { LoadingOverlay, ToastNotification } from '@/components/layout'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { theme } from '@pagopa/interop-fe-commons'
import { MIAlert } from '@pagopa/mui-italia'
import { STAGE } from './config/env'
import { useTranslation } from 'react-i18next'
import { MaintenanceBanner } from './components/shared/banners/MaintenanceBanner'
import { FirstLoadingSpinner } from './components/shared/FirstLoadingSpinner'
import { queryClient } from './config/query-client'
import type { EnvironmentBannerProps } from '@pagopa/mui-italia'
import { AuthQueries } from './api/auth'
import i18n from './config/react-i18next'
import { DEFAULT_LANG, LANGUAGES } from './config/constants'

// --- Init application ----

const urlParams = new URLSearchParams(window.location.search)
const redirectUrl = urlParams.get('redirectUrl')

const fragmentParams = new URLSearchParams(window.location.hash.replace('#', ''))
const requestedLang = fragmentParams.get('lang')?.toLowerCase() ?? ''
const isSupportedLang = requestedLang in LANGUAGES
const lang = isSupportedLang ? requestedLang : DEFAULT_LANG

if (requestedLang) {
  i18n.changeLanguage(lang)
}

if (redirectUrl) {
  const selfCareIdentityToken = fragmentParams.get('id') ?? ''
  const url = `/ui/${lang}${redirectUrl}#id=${selfCareIdentityToken}`

  window.location.replace(url)
} else if (requestedLang) {
  fragmentParams.delete('lang')
  const url = `/ui/${lang}/catalogo-e-service#${fragmentParams.toString()}`

  window.location.replace(url)
} else {
  queryClient.prefetchQuery(AuthQueries.getSessionToken())
}
// end init ---

function App() {
  const { t } = useTranslation('shared-components')
  let envBannerProps: EnvironmentBannerProps | undefined = undefined

  if (STAGE === 'UAT') {
    envBannerProps = {
      bgColor: 'warning',
      message: t('environmentBanner.content.uat'),
    }
  }

  if (STAGE === 'ATT') {
    envBannerProps = {
      bgColor: 'info',
      message: t('environmentBanner.content.att'),
    }
  }

  return (
    <ThemeProvider theme={theme}>
      {envBannerProps && envBannerProps.message && (
        <MIAlert
          variant="header"
          severity={envBannerProps.bgColor}
          description={envBannerProps.message}
        />
      )}
      <React.Suspense fallback={<FirstLoadingSpinner />}>
        <QueryClientProvider client={queryClient}>
          <CssBaseline />
          <RouterProvider />
          <LoadingOverlay />
          <ToastNotification />
          <MaintenanceBanner />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </React.Suspense>
    </ThemeProvider>
  )
}

export default App
