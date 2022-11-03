import React from 'react'
import { useTranslation } from 'react-i18next'
import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom'
import axios from 'axios'
import { Button } from '@mui/material'
import { Redirect, useNavigateRouter } from '@/router'
import CodeBlock from '../components/CodeBlock'
import { NotAuthorizedError, NotFoundError, NotImplementedError } from '@/utils/errors.utils'

type UseResolveErrorReturnType = {
  title: string
  description: string
  content: JSX.Element | null
}

function useResolveError(): UseResolveErrorReturnType {
  const { t } = useTranslation('error')
  const error = useRouteError()
  const { getRouteUrl } = useNavigateRouter()

  let title, description: string | undefined
  let content: JSX.Element | null = null

  const reloadPageButton = (
    <Button size="small" variant="contained" onClick={() => window.location.reload()}>
      {t('actions.reloadPage')}
    </Button>
  )
  const backToHomeButton = (
    <Link to={getRouteUrl('PROVIDE_ESERVICE_LIST')}>{t('actions.backToHome')}</Link>
  )

  if (error instanceof Error) {
    content = (
      <>
        {reloadPageButton}
        <CodeBlock error={error?.stack || error.message || error?.name} />
      </>
    )
  }

  if ((isRouteErrorResponse(error) && error.status === 404) || error instanceof NotFoundError) {
    content = <Redirect to="PROVIDE_ESERVICE_LIST" />
  }

  if (error instanceof NotImplementedError) {
    title = t('notImplemented.title')
    description = t('notImplemented.description')
    content = backToHomeButton
  }

  if (error instanceof NotAuthorizedError) {
    title = t('notAuthorized.title')
    description = t('notAuthorized.description')
    content = backToHomeButton
  }

  if (axios.isAxiosError(error)) {
    switch (error.response?.status) {
      case 401:
        title = t('notAuthorized.title')
        description = t('notAuthorized.description')
        content = backToHomeButton
        break
      default:
        title = t('serverError.title')
        description = t('serverError.description')
        content = (
          <>
            {reloadPageButton}
            <CodeBlock error={error} />
          </>
        )
    }
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
