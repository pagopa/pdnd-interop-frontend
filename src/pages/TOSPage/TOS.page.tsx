import React from 'react'
import { PageContainer } from '@/components/layout/containers'
import { useTranslation } from 'react-i18next'
import { OneTrustNoticesQueries } from '@/api/one-trust-notices'
import { useGeneratePath } from '@/router'
import { parseHtmlJsonToReactNode } from '@/utils/common.utils'
import { useQuery } from '@tanstack/react-query'
import useCurrentLanguage from '@/hooks/useCurrentLanguage'
import { AuthHooks } from '@/api/auth'

const TOSPage: React.FC = () => {
  const { t } = useTranslation('common', { keyPrefix: 'tos' })
  const generatePath = useGeneratePath()
  const path = generatePath('TOS')

  const { jwt, isLoadingSession } = AuthHooks.useJwt()
  const lang = useCurrentLanguage()

  const isAuthenticated = Boolean(jwt && !isLoadingSession)

  const { data: bffTermsOfService } = useQuery(
    OneTrustNoticesQueries.getNoticeContent({
      consentType: 'TOS',
      isAuthenticated,
    })
  )
  const { data: bucketTermsOfService } = useQuery(
    OneTrustNoticesQueries.getPublicNoticeContent({
      consentType: 'TOS',
      isAuthenticated,
      lang,
    })
  )

  const termsOfService = bffTermsOfService || bucketTermsOfService

  return (
    <PageContainer sx={{ maxWidth: 800, mx: 'auto', py: 12 }} title={t('title')}>
      {termsOfService && parseHtmlJsonToReactNode(termsOfService, path)}
    </PageContainer>
  )
}

export default TOSPage
