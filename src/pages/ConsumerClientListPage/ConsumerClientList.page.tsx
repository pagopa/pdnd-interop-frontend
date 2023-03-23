import React from 'react'
import { PageContainer } from '@/components/layout/containers'
import { useTranslation } from 'react-i18next'
import { ClientTable } from '@/components/shared/ClientTable'
import { useNavigateRouter } from '@/router'
import type { TopSideActions } from '@/components/layout/containers/PageContainer'
import { useJwt } from '@/hooks/useJwt'

const ConsumerClientListPage: React.FC = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'consumerClientList' })
  const { t: tCommon } = useTranslation('common')
  const { navigate } = useNavigateRouter()
  const { isAdmin } = useJwt()

  const topSideActions: TopSideActions = {
    buttons: [
      {
        action: () => navigate('SUBSCRIBE_CLIENT_CREATE'),
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
      <ClientTable clientKind="CONSUMER" />
    </PageContainer>
  )
}

export default ConsumerClientListPage
