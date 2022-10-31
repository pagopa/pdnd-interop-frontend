import React from 'react'
import { PageContainer } from '@/components/layout/containers'
import { useTranslation } from 'react-i18next'
import ClientTable, { ClientTableSkeleton } from '@/components/shared/ClientTable'
import { useNavigateRouter } from '@/router'
import { TopSideActions } from '@/components/layout/containers/PageContainer'

const ConsumerClientM2MListPage = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'consumerClientM2MList' })
  const { t: tCommon } = useTranslation('common')
  const { navigate } = useNavigateRouter()

  const topSideActions: TopSideActions = {
    buttons: [
      {
        action: () => navigate('SUBSCRIBE_INTEROP_M2M_CLIENT_CREATE'),
        label: tCommon('createNewBtn'),
        variant: 'contained',
      },
    ],
  }

  return (
    <PageContainer
      title={t('title')}
      description={t('description')}
      topSideActions={topSideActions}
    >
      <React.Suspense fallback={<ClientTableSkeleton />}>
        <ClientTable clientKind="API" />
      </React.Suspense>
    </PageContainer>
  )
}

export default ConsumerClientM2MListPage
