import React from 'react'
import { PageContainer } from '@/components/layout/containers'
import { useTranslation } from 'react-i18next'
import { OneTrustNoticesQueries } from '@/api/one-trust-notices'
import useCurrentLanguage from '@/hooks/useCurrentLanguage'
import { htmlJsonFormatParser } from '@/utils/parser'
import { useGeneratePath } from '@/router'

const TOSPage: React.FC = () => {
  const { t } = useTranslation('common', { keyPrefix: 'tos' })
  const lang = useCurrentLanguage()
  const generatePath = useGeneratePath()
  const path = generatePath('TOS')

  const { data: termsOfService } = OneTrustNoticesQueries.useTermsOfServiceNotice(lang)

  return (
    <PageContainer sx={{ maxWidth: 800, mx: 'auto', py: 12 }} title={t('title')}>
      {termsOfService && htmlJsonFormatParser(termsOfService, path)}
    </PageContainer>
  )
}

export default TOSPage
