import React from 'react'
import { PageContainer } from '@/components/layout/containers'
import { useTranslation } from 'react-i18next'
import { useNavigate } from '@/router'
import { AuthHooks } from '@/api/auth'
import type { ActionItemButton } from '@/types/common.types'

const ProviderTemplatesListPage: React.FC = () => {
  const { isAdmin } = AuthHooks.useJwt()
  const { t } = useTranslation('pages', { keyPrefix: 'providerTemplatesList' })

  const topSideActions: Array<ActionItemButton> = []

  return (
    <PageContainer title={t('title')} topSideActions={isAdmin ? topSideActions : undefined}>
      I TUOI TEMPLATE
    </PageContainer>
  )
}

export default ProviderTemplatesListPage
