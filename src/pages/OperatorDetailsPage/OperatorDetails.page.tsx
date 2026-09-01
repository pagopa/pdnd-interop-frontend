import React from 'react'
import { PageContainer } from '@/components/layout/containers'
import { useParams } from '@/router'
import {
  OperatorGeneralInfoSection,
  OperatorGeneralInfoSectionSkeleton,
} from './components/OperatorGeneralInfoSection'
import { Grid } from '@mui/material'
import { useGetClientOperatorsActions } from '@/hooks/useGetClientOperatorsActions'
import { useQuery } from '@tanstack/react-query'
import { SelfcareQueries } from '@/api/selfcare'

const OperatorDetailsPage: React.FC = () => {
  const { clientId: clientId, operatorId } = useParams<
    'SUBSCRIBE_INTEROP_M2M_CLIENT_OPERATOR_EDIT' | 'SUBSCRIBE_CLIENT_OPERATOR_EDIT'
  >()
  const { data: operator, isLoading } = useQuery(SelfcareQueries.getSingleUser(operatorId))
  const operatorFullname = `${operator?.name} ${operator?.familyName}`

  const { actions } = useGetClientOperatorsActions(operatorId, clientId)

  return (
    <PageContainer
      isLoading={isLoading}
      title={operatorFullname}
      topSideActions={actions}
      navigation={{ showBackButton: true }}
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
