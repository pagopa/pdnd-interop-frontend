import React from 'react'
import { PageContainer } from '@/components/layout/containers'
import { AuthHooks } from '@/api/auth'
import { TemplateQueries, TemplateServices } from '@/api/template'

import type { ActionItemButton } from '@/types/common.types'
import { useTranslation } from 'react-i18next'
import { Filters } from '@pagopa/interop-fe-commons'
import { EServiceCatalogGridSkeleton } from '../ConsumerEServiceCatalogPage/components'
import { useQuery } from '@tanstack/react-query'

const ProviderEServiceTemplatesCatalogPage: React.FC = () => {
  const { isAdmin } = AuthHooks.useJwt()
  const { t } = useTranslation('pages', { keyPrefix: 'providerEServiceTemplatesCatalog' })
  const topSideActions: Array<ActionItemButton> = []

  return (
    <PageContainer
      title={t('title')}
      description={t('description')}
      topSideActions={isAdmin ? topSideActions : undefined}
    >
      CATALOGO TEMPLATE
      <ProviderEServiceTemplatesCatalogWrapper params={{ limit: 20, offset: 1 }} />
    </PageContainer>
  )
}

const ProviderEServiceTemplatesCatalogWrapper: React.FC<{
  params: { limit: number; offset: number }
}> = ({ params }) => {
  const { data, isFetching } = useQuery(TemplateQueries.getProviderTemplatesCatalogList(params))

  if (!data && isFetching) return <EServiceCatalogGridSkeleton />

  return <div></div>
}

export default ProviderEServiceTemplatesCatalogPage
