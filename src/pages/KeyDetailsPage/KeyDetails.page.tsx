import React from 'react'
import { ClientQueries } from '@/api/client'
import { PageBottomActionsContainer, PageContainer } from '@/components/layout/containers'
import { Link, useParams } from '@/router'
import { Trans, useTranslation } from 'react-i18next'
import { formatTopSideActions } from '@/utils/common.utils'
import { useClientKind } from '@/hooks/useClientKind'
import {
  KeyGeneralInfoSectionSkeleton,
  KeyGeneralInfoSection,
} from './components/KeyGeneralInfoSection'
import useGetKeyActions from '@/hooks/useGetKeyActions'
import { Alert, Link as MUILink } from '@mui/material'
import { clientKeyGuideLink } from '@/config/constants'

const KeyDetailsPage: React.FC = () => {
  const { t } = useTranslation('key')
  const clientKind = useClientKind()
  const { clientId, kid } = useParams<
    'SUBSCRIBE_INTEROP_M2M_CLIENT_KEY_EDIT' | 'SUBSCRIBE_CLIENT_KEY_EDIT'
  >()

  const backToOperatorsListRouteKey =
    clientKind === 'API' ? 'SUBSCRIBE_INTEROP_M2M_CLIENT_EDIT' : 'SUBSCRIBE_CLIENT_EDIT'

  const { data: publicKey, isLoading } = ClientQueries.useGetSingleKey(clientId, kid, {
    suspense: false,
  })

  const { actions } = useGetKeyActions(clientId, kid)
  const topSideActions = formatTopSideActions(actions, { variant: 'contained' })

  return (
    <PageContainer isLoading={isLoading} title={publicKey?.name} topSideActions={topSideActions}>
      <React.Suspense fallback={<KeyGeneralInfoSectionSkeleton />}>
        {publicKey?.isOrphan && (
          <Alert severity="error">
            <Trans components={{ 1: <MUILink href={clientKeyGuideLink} target="_blank" /> }}>
              {t('edit.orphanAlertLabel')}
            </Trans>
          </Alert>
        )}
        <KeyGeneralInfoSection clientId={clientId} kid={kid} />
      </React.Suspense>
      <PageBottomActionsContainer>
        <Link
          as="button"
          variant="outlined"
          to={backToOperatorsListRouteKey}
          params={{ clientId }}
          options={{ urlParams: { tab: 'publicKeys' } }}
        >
          {t('backToKeyListBtn')}
        </Link>
      </PageBottomActionsContainer>
    </PageContainer>
  )
}

export default KeyDetailsPage
