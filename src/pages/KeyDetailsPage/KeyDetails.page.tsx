import React from 'react'
import { ClientQueries } from '@/api/client'
import { PageContainer } from '@/components/layout/containers'
import { useParams } from '@/router'
import { Trans, useTranslation } from 'react-i18next'
import { useClientKind } from '@/hooks/useClientKind'
import {
  KeyGeneralInfoSectionSkeleton,
  KeyGeneralInfoSection,
} from './components/KeyGeneralInfoSection'
import useGetKeyActions from '@/hooks/useGetKeyActions'
import { Alert, Link as MUILink } from '@mui/material'
import { clientKeyGuideLink } from '@/config/constants'
import { useQuery } from '@tanstack/react-query'

const KeyDetailsPage: React.FC = () => {
  const { t } = useTranslation('key')
  const clientKind = useClientKind()
  const { clientId, kid } = useParams<
    'SUBSCRIBE_INTEROP_M2M_CLIENT_KEY_EDIT' | 'SUBSCRIBE_CLIENT_KEY_EDIT'
  >()

  const backToOperatorsListRouteKey =
    clientKind === 'API' ? 'SUBSCRIBE_INTEROP_M2M_CLIENT_EDIT' : 'SUBSCRIBE_CLIENT_EDIT'

  const { data: publicKey, isLoading } = useQuery(ClientQueries.getSingleKey(clientId, kid))

  const { actions } = useGetKeyActions(clientId, kid)

  return (
    <PageContainer
      isLoading={isLoading}
      title={publicKey?.name}
      topSideActions={actions}
      backToAction={{
        label: t('backToKeyListBtn'),
        to: backToOperatorsListRouteKey,
        params: { clientId },
        urlParams: { tab: 'publicKeys' },
      }}
    >
      <React.Suspense fallback={<KeyGeneralInfoSectionSkeleton />}>
        {publicKey?.isOrphan && (
          <Alert severity="warning">
            <Trans components={{ 1: <MUILink href={clientKeyGuideLink} target="_blank" /> }}>
              {t('edit.orphanAlertLabel')}
            </Trans>
          </Alert>
        )}
        <KeyGeneralInfoSection clientId={clientId} kid={kid} />
      </React.Suspense>
    </PageContainer>
  )
}

export default KeyDetailsPage
