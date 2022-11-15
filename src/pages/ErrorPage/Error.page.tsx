import React from 'react'
import useResolveError from './hooks/useResolveError'
import { PageContainer } from '@/components/layout/containers'
import { FallbackProps } from 'react-error-boundary'

const ErrorPage: React.FC<FallbackProps> = (props) => {
  const { title, description, content } = useResolveError(props)

  return (
    <PageContainer title={title} description={description}>
      {content}
    </PageContainer>
  )
}

export default ErrorPage
