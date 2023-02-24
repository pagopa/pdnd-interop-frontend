import React from 'react'
import useResolveError from '@/hooks/useResolveError'
import { PageContainer } from '@/components/layout/containers'
import type { FallbackProps } from 'react-error-boundary'

const ErrorPage: React.FC<FallbackProps> = (props) => {
  const { title, description, content } = useResolveError(props)

  return (
    <PageContainer sx={{ flex: 1 }} title={title} description={description}>
      {content}
    </PageContainer>
  )
}

export default ErrorPage
