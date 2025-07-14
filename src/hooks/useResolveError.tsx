import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { isRouteErrorResponse } from 'react-router-dom'
import { Button, TextField, Typography } from '@mui/material'
import { Redirect, Link } from '@/router'
import {
  AssistencePartySelectionError,
  ForbiddenError,
  NotFoundError,
  TokenExchangeError,
  UnauthorizedError,
} from '@/utils/errors.utils'
import type { FallbackProps } from 'react-error-boundary'
import { isDevelopment, SELFCARE_BASE_URL } from '@/config/env'
import { CodeBlock } from '@pagopa/interop-fe-commons'
import { AxiosError } from 'axios'
import { Stack } from '@mui/system'
import { assistanceLink, STORAGE_KEY_SESSION_TOKEN } from '@/config/constants'
import { CopyToClipboardButton } from '@pagopa/mui-italia'
import { parseJwt } from '@/api/auth/auth.utils'
import { hasSessionExpired } from '@/utils/common.utils'
import { DialogSessionExpired } from '@/components/dialogs/DialogSessionExpired'
import { useErrorData } from '@/stores/error-data.store'

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
  const correlationId = error.response?.data.correlationId
  const errorCode = error.response?.data.errros.errorCode

  const { setErrorData } = useErrorData()

  useEffect(() => {
    if (correlationId) {
      setErrorData(correlationId, errorCode)
    }
  }, [correlationId, errorCode, setErrorData])

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

  const correlationIdSection = (
    <Stack justifyContent="center" alignItems="center" spacing={4}>
      <Typography>{t('axiosError.correlationIdText')}</Typography>
      <TextField
        sx={{ maxWidth: 420 }}
        id="outlined-read-only-input"
        label="Identificativo"
        defaultValue={correlationId}
        InputProps={{
          readOnly: true,
          endAdornment: (
            <CopyToClipboardButton
              value={correlationId!}
              tooltipTitle={t('axiosError.tooltipTitle')}
            />
          ),
        }}
      />
      <Button
        target="_blank"
        href={`${assistanceLink}?data={"traceId":"${correlationId}", "errorCode":"${errorCode}"}`}
        style={{ backgroundColor: 'transparent', fontWeight: 700 }}
        disableRipple
      >
        {t('actions.goToSupportPage')}
      </Button>
    </Stack>
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
        {correlationId && correlationIdSection}
      </>
    )
  }

  if ((isRouteErrorResponse(error) && error.status === 404) || error instanceof NotFoundError) {
    content = <Redirect to="NOT_FOUND" />
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
    const sessionToken = window.localStorage.getItem(STORAGE_KEY_SESSION_TOKEN)
    if (sessionToken) {
      const exp = parseJwt(sessionToken).jwt?.exp
      if (hasSessionExpired(exp)) {
        content = <DialogSessionExpired type="sessionExpired" />
      }
    }
  }

  return { title, description, content }
}

export default useResolveError
