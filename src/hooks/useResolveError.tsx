import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@mui/material'

import {
  AssistencePartySelectionError,
  ForbiddenError,
  TokenExchangeError,
  UnauthorizedError,
} from '@/utils/errors.utils'
import { FE_LOGIN_URL, isDevelopment, SELFCARE_BASE_URL } from '@/config/env'
import { CodeBlock } from '@pagopa/interop-fe-commons'
import { AxiosError } from 'axios'
import type { ErrorComponentProps } from '@tanstack/react-router'
import { RouterButton } from '@/components/shared/RouterButton'

type UseResolveErrorReturnType = {
  title: string
  description: string
  content: JSX.Element | null
}

function useResolveError(fallbackProps: ErrorComponentProps): UseResolveErrorReturnType {
  const { t } = useTranslation('error')

  const { error, reset } = fallbackProps

  let title, description: string | undefined
  let content: JSX.Element | null = null

  const reloadPageButton = (
    <Button size="small" variant="contained" onClick={() => window.location.reload()}>
      {t('actions.reloadPage')}
    </Button>
  )

  const retryQueryButton = (
    <Button size="small" variant="contained" onClick={reset}>
      {t('actions.retry')}
    </Button>
  )

  const backToHomeButton = (
    <RouterButton to="/fruizione/catalogo-e-service" variant="contained">
      {t('actions.backToHome')}
    </RouterButton>
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
