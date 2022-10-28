import React from 'react'
import useResolveError from './hooks/useResolveError'
import { PageContainer } from '@/components/layout/containers'

const ErrorPage: React.FC = () => {
  const { title, description, content } = useResolveError()

  return (
    <PageContainer title={title} description={description}>
      {content}
    </PageContainer>
  )
}

export default ErrorPage
