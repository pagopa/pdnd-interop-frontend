import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@mui/material'

import {
  AssistencePartySelectionError,
  UnauthorizedError,
  TokenExchangeError,
  AuthenticationError,
  NotFoundError,
} from '@/utils/errors.utils'
import { FE_LOGIN_URL, isDevelopment, SELFCARE_BASE_URL } from '@/config/env'
import { CodeBlock } from '@pagopa/interop-fe-commons'
import { AxiosError } from 'axios'
import { type ErrorComponentProps } from '@tanstack/react-router'
import { RouterButton } from '@/components/shared/RouterButton'
import { match, P } from 'ts-pattern'

type UseResolveErrorReturnType = {
  title: string
  description: string
  content: JSX.Element | null
}

function useResolveError({ error, reset }: ErrorComponentProps): UseResolveErrorReturnType {
  const { t } = useTranslation('error')

  return match(error)
    .returnType<UseResolveErrorReturnType>()
    .with(P.instanceOf(AssistencePartySelectionError), () => ({
      title: t('assistencePartySelection.title'),
      description: t('assistencePartySelection.description'),
      content: null,
    }))
    .with(P.instanceOf(TokenExchangeError), () => ({
      title: t('tokenExchange.title'),
      description: t('tokenExchange.description'),
      content: <BackToSelfcareButton />,
    }))
    .with(P.instanceOf(AxiosError), (err: AxiosError) => ({
      title: t('axiosError.title'),
      description: t('axiosError.description'),
      content: (
        <>
          {isDevelopment && <CodeBlock code={err.response ?? err} />}
          <RetryQueryButton reset={reset} />
        </>
      ),
    }))
    .with(P.instanceOf(UnauthorizedError), () => ({
      title: t('forbidden.title'),
      description: t('forbidden.description'),
      content: <BackToHomeButton />,
    }))
    .with(P.instanceOf(AuthenticationError), () => {
      window.location.assign(FE_LOGIN_URL)
      return {
        title: t('default.title'),
        description: t('default.description'),
        content: null,
      }
    })
    .with(P.instanceOf(NotFoundError), () => ({
      title: t('notFound.title'),
      description: t('notFound.description'),
      content: <BackToHomeButton />,
    }))
    .otherwise(() => ({
      title: t('default.title'),
      description: t('default.description'),
      content: (
        <>
          {isDevelopment && <CodeBlock code={error?.stack || error.message || error?.name} />}
          {ReloadPageButton}
        </>
      ),
    }))
}

function ReloadPageButton() {
  const { t } = useTranslation('error')

  return (
    <Button size="small" variant="contained" onClick={() => window.location.reload()}>
      {t('actions.reloadPage')}
    </Button>
  )
}

function RetryQueryButton({ reset }: { reset: VoidFunction }) {
  const { t } = useTranslation('error')

  return (
    <Button size="small" variant="contained" onClick={reset}>
      {t('actions.retry')}
    </Button>
  )
}

function BackToHomeButton() {
  const { t } = useTranslation('error')

  return (
    <RouterButton to="/fruizione/catalogo-e-service" variant="contained">
      {t('actions.backToHome')}
    </RouterButton>
  )
}

function BackToSelfcareButton() {
  const { t } = useTranslation('error')

  return (
    <Button size="small" variant="contained" href={SELFCARE_BASE_URL}>
      {t('actions.backToSelfcare')}
    </Button>
  )
}

export default useResolveError
