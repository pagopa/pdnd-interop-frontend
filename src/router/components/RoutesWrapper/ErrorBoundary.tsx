import React from 'react'
import { ErrorPage } from '@/pages'
import { QueryErrorResetBoundary } from '@tanstack/react-query'
import { ErrorBoundary as _ErrorBoundary } from 'react-error-boundary'

interface ErrorBoundaryProps {
  children: React.ReactNode
}

export const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children }) => {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <_ErrorBoundary onReset={reset} FallbackComponent={ErrorPage}>
          {children}
        </_ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  )
}
