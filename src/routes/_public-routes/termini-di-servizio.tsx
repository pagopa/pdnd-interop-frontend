import { OneTrustNoticesQueries } from '@/api/one-trust-notices'
import { PageContainer } from '@/components/layout/containers'
import { useGeneratePath } from '@/router'
import { parseHtmlJsonToReactNode } from '@/utils/common.utils'
import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

export const Route = createFileRoute('/_public-routes/termini-di-servizio')({
  component: TerminiDiServizioPage,
  staticData: {
    authLevels: ['admin', 'support', 'api', 'security'],
    routeKey: 'TOS',
  },
})

function TerminiDiServizioPage() {
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
