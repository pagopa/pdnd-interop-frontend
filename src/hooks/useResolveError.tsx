import React from 'react'
import { useTranslation } from 'react-i18next'
import { isRouteErrorResponse } from 'react-router-dom'
import { Button } from '@mui/material'
import { Redirect, Link } from '@/router'
import {
  AssistencePartySelectionError,
  ForbiddenError,
  NotFoundError,
  TokenExchangeError,
  UnauthorizedError,
} from '@/utils/errors.utils'
import type { FallbackProps } from 'react-error-boundary'
import { FE_LOGIN_URL, isDevelopment, SELFCARE_BASE_URL } from '@/config/env'
import { CodeBlock } from '@pagopa/interop-fe-commons'
import { AxiosError } from 'axios'

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
        {isDevelopment && <CodeBlock code={error?.stack || error.message || error?.name} />}
        {reloadPageButton}
      </>
    )
  }

  if ((isRouteErrorResponse(error) && error.status === 404) || error instanceof NotFoundError) {
    content = <Redirect to="NOT_FOUND" />
  }

  if (error instanceof ForbiddenError) {
    title = t('forbidden.title')
    description = t('forbidden.description')
    content = backToHomeButton
  }

  if (error instanceof AxiosError) {
    title = t('axiosError.title')
    description = t('axiosError.description')
    content = (
      <>
        {isDevelopment && <CodeBlock code={error.response ?? error} />}
        {retryQueryButton}
      </>
    )
  }

  if (error instanceof TokenExchangeError) {
    title = t('tokenExchange.title')
    description = t('tokenExchange.description')
    content = backToSelfcareButton
  }

  if (error instanceof AssistencePartySelectionError) {
    title = t('assistencePartySelection.title')
    description = t('assistencePartySelection.description')
    content = null
  }

  if (!title) {
    title = t('default.title')!
  }

  if (!description) {
    description = t('default.description')!
  }

  if (error instanceof UnauthorizedError) {
    window.location.assign(FE_LOGIN_URL)
  }

  return { title, description, content }
}

export default useResolveError
