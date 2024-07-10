import { OneTrustNoticesQueries } from '@/api/one-trust-notices'
import { PageContainer } from '@/components/layout/containers'
import { useGeneratePath } from '@/router'
import { parseHtmlJsonToReactNode } from '@/utils/common.utils'
import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

export const Route = createFileRoute('/_public-routes-wrapper/privacy-policy')({
  component: PrivacyPolicyPage,
  staticData: {
    authLevels: ['admin', 'support', 'api', 'security'],
    routeKey: 'PRIVATE_POLICY',
  },
})

function PrivacyPolicyPage() {
  const { t } = useTranslation('common', { keyPrefix: 'privacyPolicy' })
  const generatePath = useGeneratePath()
  const path = generatePath('PRIVACY_POLICY')

  const { data: bffPrivacyPolicy } = OneTrustNoticesQueries.useGetNoticeContent('PP')
  const { data: bucketPrivacyPolicy } = OneTrustNoticesQueries.useGetPublicNoticeContent('PP')

  const privacyPolicy = bffPrivacyPolicy || bucketPrivacyPolicy

  return (
    <PageContainer sx={{ maxWidth: 800, mx: 'auto', py: 12 }} title={t('title')}>
      {privacyPolicy && parseHtmlJsonToReactNode(privacyPolicy, path)}
    </PageContainer>
  )
}
