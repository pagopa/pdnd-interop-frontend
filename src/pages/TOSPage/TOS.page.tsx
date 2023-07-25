import React from 'react'
import { PageContainer } from '@/components/layout/containers'
import { useTranslation } from 'react-i18next'
import { OneTrustNoticesQueries } from '@/api/one-trust-notices'
import { useGeneratePath } from '@/router'
import { parseHtmlJsonToReactNode } from '@/utils/common.utils'

const TOSPage: React.FC = () => {
  const { t } = useTranslation('common', { keyPrefix: 'tos' })
  const generatePath = useGeneratePath()
  const path = generatePath('TOS')

  const { data: bffTermsOfService } = OneTrustNoticesQueries.useGetNoticeContent('TOS')
  const { data: bucketTermsOfService } = OneTrustNoticesQueries.useGetPublicNoticeContent('TOS')

  const termsOfService = bffTermsOfService || bucketTermsOfService

  return (
    <PageContainer sx={{ maxWidth: 800, mx: 'auto', py: 12 }} title={t('title')}>
      {termsOfService && parseHtmlJsonToReactNode(termsOfService, path)}
    </PageContainer>
  )
}

export default TOSPage
