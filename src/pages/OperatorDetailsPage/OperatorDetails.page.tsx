import React from 'react'
import { ClientQueries } from '@/api/client'
import { PageContainer } from '@/components/layout/containers'
import { useParams } from '@/router'
import {
  OperatorGeneralInfoSection,
  OperatorGeneralInfoSectionSkeleton,
} from './components/OperatorGeneralInfoSection'
import { useTranslation } from 'react-i18next'
import { Grid } from '@mui/material'
import { useClientKind } from '@/hooks/useClientKind'
import { useGetClientOperatorsActions } from '@/hooks/useGetClientOperatorsActions'
import { useQuery } from '@tanstack/react-query'

const OperatorDetailsPage: React.FC = () => {
  const clientKind = useClientKind()
  const { t } = useTranslation('user')

  const { clientId: clientId, operatorId } = useParams<
    'SUBSCRIBE_INTEROP_M2M_CLIENT_OPERATOR_EDIT' | 'SUBSCRIBE_CLIENT_OPERATOR_EDIT'
  >()
  const { data: operator, isLoading } = useQuery(ClientQueries.getSingleOperator(operatorId))
  const operatorFullname = `${operator?.name} ${operator?.familyName}`

  const { actions } = useGetClientOperatorsActions(operatorId, clientId)

  const backToOperatorsListRouteKey =
    clientKind === 'API' ? 'SUBSCRIBE_INTEROP_M2M_CLIENT_EDIT' : 'SUBSCRIBE_CLIENT_EDIT'

  return (
    <PageContainer
      isLoading={isLoading}
      title={operatorFullname}
      topSideActions={actions}
      backToAction={{
        label: t('backToMemberListBtn'),
        to: backToOperatorsListRouteKey,
        urlParams: { tab: 'clientOperators' },
        params: { clientId },
      }}
    >
      <Grid spacing={2} container>
        <Grid item xs={7}>
          <React.Suspense fallback={<OperatorGeneralInfoSectionSkeleton />}>
            <OperatorGeneralInfoSection operatorId={operatorId} />
          </React.Suspense>
        </Grid>
      </Grid>
    </PageContainer>
  )
}

export default OperatorDetailsPage
