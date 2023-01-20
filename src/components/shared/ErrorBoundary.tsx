import React from 'react'
import { QueryErrorResetBoundary } from '@tanstack/react-query'
import { ErrorBoundary as _ErrorBoundary, FallbackProps } from 'react-error-boundary'

interface ErrorBoundaryProps {
  children: React.ReactNode
  FallbackComponent: React.ComponentType<FallbackProps>
}

export const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children, FallbackComponent }) => {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <_ErrorBoundary onReset={reset} FallbackComponent={FallbackComponent}>
          {children}
        </_ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  )
}
