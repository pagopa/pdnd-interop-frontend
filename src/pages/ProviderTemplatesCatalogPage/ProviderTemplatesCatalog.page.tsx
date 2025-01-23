import React from 'react'
import { PageContainer } from '@/components/layout/containers'
import { AuthHooks } from '@/api/auth'
import type { ActionItemButton } from '@/types/common.types'
import { useTranslation } from 'react-i18next'

const ProviderTemplatesCatalogPage: React.FC = () => {
  const { isAdmin } = AuthHooks.useJwt()
  const { t } = useTranslation('pages', { keyPrefix: 'providerTemplatesCatalog' })
  const topSideActions: Array<ActionItemButton> = []

  return (
    <PageContainer
      title={t('title')}
      description={t('description')}
      topSideActions={isAdmin ? topSideActions : undefined}
    >
      CATALOGO TEMPLATE
    </PageContainer>
  )
}

export default ProviderTemplatesCatalogPage
