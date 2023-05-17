import React from 'react'
import { useTranslation } from 'react-i18next'
import { isRouteErrorResponse } from 'react-router-dom'
import { Button } from '@mui/material'
import { Redirect, Link } from '@/router'
import {
  NotAuthorizedError,
  NotFoundError,
  ServerError,
  TokenExchangeError,
} from '@/utils/errors.utils'
import type { FallbackProps } from 'react-error-boundary'
import { isDevelopment, SELFCARE_BASE_URL } from '@/config/env'
import { CodeBlock } from '@pagopa/interop-fe-commons'

type UseResolveErrorReturnType = {
  title: string
  description: string
  content: JSX.Element | null
}

function useResolveError(fallbackProps: FallbackProps): UseResolveErrorReturnType {
  const { t } = useTranslation('error')

  const { error, resetErrorBoundary } = fallbackProps

  let title, description: string | undefined
  let content: JSX.Element | null = null

  const reloadPageButton = (
    <Button size="small" variant="contained" onClick={() => window.location.reload()}>
      {t('actions.reloadPage')}
    </Button>
  )

  const retryQueryButton = (
    <Button size="small" variant="contained" onClick={resetErrorBoundary}>
      {t('actions.retry')}
    </Button>
  )

  const backToHomeButton = (
    <Link as="button" variant="contained" to="SUBSCRIBE_CATALOG_LIST">
      {t('actions.backToHome')}
    </Link>
  )

  const backToSelfcareButton = (
    <Button size="small" variant="contained" href={SELFCARE_BASE_URL}>
      {t('actions.backToSelfcare')}
    </Button>
  )

  if (error instanceof Error) {
    content = (
      <>
        {reloadPageButton}
        {isDevelopment && <CodeBlock code={error?.stack || error.message || error?.name} />}
      </>
    )
  }

  if ((isRouteErrorResponse(error) && error.status === 404) || error instanceof NotFoundError) {
    content = <Redirect to="NOT_FOUND" />
  }

  if (error instanceof NotAuthorizedError) {
    title = t('notAuthorized.title')
    description = t('notAuthorized.description')
    content = backToHomeButton
  }

  if (error instanceof ServerError) {
    title = t('serverError.title')
    description = t('serverError.description')
    content = (
      <>
        {retryQueryButton}
        {isDevelopment && <CodeBlock code={error.response ?? error} />}
      </>
    )
  }

  if (error instanceof TokenExchangeError) {
    title = t('tokenExchange.title')
    description = t('tokenExchange.description')
    content = <>{backToSelfcareButton}</>
  }

  if (!title) {
    title = t('default.title')!
  }

  if (!description) {
    description = t('default.description')!
  }

  return { title, description, content }
}

export default useResolveError
