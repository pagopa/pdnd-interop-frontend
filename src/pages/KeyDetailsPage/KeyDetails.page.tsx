import React from 'react'
import { ClientQueries } from '@/api/client'
import { PageBottomActionsContainer, PageContainer } from '@/components/layout/containers'
import { RouterLink, useRouteParams } from '@/router'
import { Trans, useTranslation } from 'react-i18next'
import { formatTopSideActions } from '@/utils/common.utils'
import { useClientKind } from '@/hooks/useClientKind'
import {
  KeyGeneralInfoSectionSkeleton,
  KeyGeneralInfoSection,
} from './components/KeyGeneralInfoSection'
import useGetKeyActions from '@/hooks/useGetKeyActions'
import { Alert, Link } from '@mui/material'
import { clientKeyGuideLink } from '@/config/constants'

const KeyDetailsPage: React.FC = () => {
  const { t } = useTranslation('key')
  const clientKind = useClientKind()
  const { clientId, kid } = useRouteParams<
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
        <KeyGeneralInfoSection clientId={clientId} kid={kid} />
        {publicKey?.isOrphan && (
          <Alert severity="error">
            <Trans components={{ 1: <Link href={clientKeyGuideLink} target="_blank" /> }}>
              {t('edit.orphanAlertLabel')}
            </Trans>
          </Alert>
        )}
      </React.Suspense>
      <PageBottomActionsContainer>
        <RouterLink
          as="button"
          variant="outlined"
          to={backToOperatorsListRouteKey}
          params={{ clientId }}
          options={{ urlParams: { tab: 'publicKeys' } }}
        >
          {t('backToKeyListBtn')}
        </RouterLink>
      </PageBottomActionsContainer>
    </PageContainer>
  )
}

export default KeyDetailsPage
