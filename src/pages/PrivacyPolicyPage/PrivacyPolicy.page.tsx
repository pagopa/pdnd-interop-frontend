import React from 'react'
import { PageContainer } from '@/components/layout/containers'
import { useTranslation } from 'react-i18next'
import { OneTrustNoticesQueries } from '@/api/one-trust-notices'
import { useGeneratePath } from '@/router'
import { parseHtmlJsonToReactNode } from '@/utils/common.utils'
import { useQuery } from '@tanstack/react-query'
import { AuthHooks } from '@/api/auth'
import useCurrentLanguage from '@/hooks/useCurrentLanguage'

const PrivacyPolicyPage: React.FC = () => {
  const { t } = useTranslation('common', { keyPrefix: 'privacyPolicy' })
  const generatePath = useGeneratePath()
  const path = generatePath('PRIVACY_POLICY')

  const { jwt } = AuthHooks.useJwt()
  const lang = useCurrentLanguage()

  const isAuthenticated = Boolean(jwt)

  const { data: bffPrivacyPolicy } = useQuery(
    OneTrustNoticesQueries.getNoticeContent({
      consentType: 'PP',
      isAuthenticated,
    })
  )
  const { data: bucketPrivacyPolicy } = useQuery(
    OneTrustNoticesQueries.getPublicNoticeContent({
      consentType: 'PP',
      isAuthenticated,
      lang,
    })
  )

  const privacyPolicy = bffPrivacyPolicy || bucketPrivacyPolicy

  return (
    <PageContainer sx={{ maxWidth: 800, mx: 'auto', py: 12 }} title={t('title')}>
      {privacyPolicy && parseHtmlJsonToReactNode(privacyPolicy, path)}
    </PageContainer>
  )
}

export default PrivacyPolicyPage
