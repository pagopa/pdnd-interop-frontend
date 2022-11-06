import React from 'react'
import { ClientMutations, ClientQueries } from '@/api/client'
import { PageBottomActionsContainer, PageContainer } from '@/components/layout/containers'
import { RouterLink, useCurrentRoute, useRouteParams } from '@/router'
import {
  OperatorGeneralInfoSection,
  OperatorGeneralInfoSectionSkeleton,
} from './components/OperatorGeneralInfoSection'
import { OperatorKeysSection, OperatorKeysSectionSkeleton } from './components/OperatorKeysSection'
import { ActionItem } from '@/types/common.types'
import { useJwt } from '@/hooks/useJwt'
import { useTranslation } from 'react-i18next'
import { formatTopSideActions } from '@/utils/common.utils'
import { Grid } from '@mui/material'
import { useClientKind } from '../ConsumerClientManagePage/hooks/useClientKind'

const OperatorDetailsPage: React.FC = () => {
  const { isAdmin } = useJwt()
  const { mode } = useCurrentRoute()
  const clientKind = useClientKind()
  const { t } = useTranslation('user')
  const { mutate: removeOperatorFromClient } = ClientMutations.useRemoveOperator()

  const { clientId: clientId, operatorId } = useRouteParams<
    'SUBSCRIBE_INTEROP_M2M_CLIENT_OPERATOR_EDIT' | 'SUBSCRIBE_CLIENT_OPERATOR_EDIT'
  >()
  const { data: operator, isLoading } = ClientQueries.useGetSingleOperator(operatorId, {
    suspense: false,
  })

  const operatorFullname = `${operator?.name} ${operator?.familyName}`

  const actions: Array<ActionItem> = []

  if (mode === 'consumer' && isAdmin) {
    actions.push({
      action: removeOperatorFromClient.bind(null, { clientId, relationshipId: operatorId }),
      label: t('actions.removeFromClient'),
    })
  }

  const topSideActions = formatTopSideActions(actions, { variant: 'contained' })
  const backToOperatorsListRouteKey =
    clientKind === 'API' ? 'SUBSCRIBE_INTEROP_M2M_CLIENT_EDIT' : 'SUBSCRIBE_CLIENT_EDIT'

  return (
    <PageContainer
      showSkeleton={isLoading}
      title={operatorFullname}
      topSideActions={topSideActions}
    >
      <Grid spacing={2} container>
        <Grid item xs={7}>
          <React.Suspense fallback={<OperatorGeneralInfoSectionSkeleton />}>
            <OperatorGeneralInfoSection operatorId={operatorId} />
          </React.Suspense>
        </Grid>
        <Grid item xs={5}>
          {operator?.product.role === 'security' && (
            <React.Suspense fallback={<OperatorKeysSectionSkeleton />}>
              <OperatorKeysSection clientId={clientId} operatorId={operatorId} />
            </React.Suspense>
          )}
        </Grid>
      </Grid>
      <PageBottomActionsContainer>
        <RouterLink
          as="button"
          variant="outlined"
          to={backToOperatorsListRouteKey}
          params={{ clientId }}
          options={{ urlParams: { tab: 'clientOperators' } }}
        >
          {t('backToMemberListBtn')}
        </RouterLink>
      </PageBottomActionsContainer>
    </PageContainer>
  )
}

export default OperatorDetailsPage
