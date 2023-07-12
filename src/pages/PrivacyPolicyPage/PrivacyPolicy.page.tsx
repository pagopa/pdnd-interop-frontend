import React from 'react'
import { PageContainer } from '@/components/layout/containers'
import { useTranslation } from 'react-i18next'
import { OneTrustNoticesQueries } from '@/api/one-trust-notices'
import { useGeneratePath } from '@/router'
import { parseHtmlJsonToReactNode } from '@/utils/common.utils'

const PrivacyPolicyPage: React.FC = () => {
  const { t } = useTranslation('common', { keyPrefix: 'privacyPolicy' })
  const generatePath = useGeneratePath()
  const path = generatePath('PRIVACY_POLICY')

  const { data: termsOfService } = OneTrustNoticesQueries.useGetNoticeContent('PP')

  return (
    <PageContainer sx={{ maxWidth: 800, mx: 'auto', py: 12 }} title={t('title')}>
      {termsOfService && parseHtmlJsonToReactNode(termsOfService, path)}
    </PageContainer>
  )
}

export default PrivacyPolicyPage
