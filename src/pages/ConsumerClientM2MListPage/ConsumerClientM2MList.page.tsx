import React from 'react'
import { PageContainer } from '@/components/layout/containers'
import { useTranslation } from 'react-i18next'
import { ClientTable } from '@/components/shared/ClientTable'
import { useNavigateRouter } from '@/router'
import type { TopSideActions } from '@/components/layout/containers/PageContainer'
import { useJwt } from '@/hooks/useJwt'

const ConsumerClientM2MListPage: React.FC = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'consumerClientM2MList' })
  const { t: tCommon } = useTranslation('common')
  const { navigate } = useNavigateRouter()
  const { isAdmin } = useJwt()

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
      topSideActions={isAdmin ? topSideActions : undefined}
    >
      <ClientTable clientKind="API" />
    </PageContainer>
  )
}

export default ConsumerClientM2MListPage
