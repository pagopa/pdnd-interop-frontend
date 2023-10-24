import React from 'react'
import { ClientQueries } from '@/api/client'
import { PageContainer } from '@/components/layout/containers'
import { useCurrentRoute, useParams } from '@/router'
import {
  OperatorGeneralInfoSection,
  OperatorGeneralInfoSectionSkeleton,
} from './components/OperatorGeneralInfoSection'
import type { ActionItemButton } from '@/types/common.types'
import { useTranslation } from 'react-i18next'
import { Grid } from '@mui/material'
import { useClientKind } from '@/hooks/useClientKind'
import { AuthHooks } from '@/api/auth'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { useDialog } from '@/stores'

const OperatorDetailsPage: React.FC = () => {
  const { isAdmin, jwt } = AuthHooks.useJwt()
  const { mode } = useCurrentRoute()
  const clientKind = useClientKind()
  const { t } = useTranslation('user')
  const { openDialog } = useDialog()

  const { clientId: clientId, operatorId } = useParams<
    'SUBSCRIBE_INTEROP_M2M_CLIENT_OPERATOR_EDIT' | 'SUBSCRIBE_CLIENT_OPERATOR_EDIT'
  >()
  const { data: operator, isLoading } = ClientQueries.useGetSingleOperator(operatorId, {
    suspense: false,
  })

  const operatorFullname = `${operator?.name} ${operator?.familyName}`

  const handleOpenDeleteDialog = () => {
    if (!jwt?.selfcareId) return

    openDialog({
      type: 'deleteOperator',
      selfcareId: jwt.selfcareId,
      userId: operatorId,
    })
  }

  const handleOpenRemoveOperatorFromClientDialog = () => {
    openDialog({
      type: 'removeOperatorFromClient',
      clientId: clientId,
      relationshipId: operatorId,
    })
  }

  const actions: Array<ActionItemButton> = []

  if (mode === 'consumer') {
    actions.push({
      action: handleOpenRemoveOperatorFromClientDialog,
      label: t('actions.removeFromClient.label'),
      color: 'error',
      icon: RemoveCircleOutlineIcon,
      disabled: !isAdmin,
      tooltip: !isAdmin ? t('actions.removeFromClient.tooltip') : undefined,
    })

    actions.push({
      action: handleOpenDeleteDialog,
      label: t('actions.delete.label'),
      color: 'error',
      icon: DeleteOutlineIcon,
      disabled: !isAdmin,
      tooltip: !isAdmin ? t('actions.delete.tooltip') : undefined,
    })
  }

  const backToOperatorsListRouteKey =
    clientKind === 'API' ? 'SUBSCRIBE_INTEROP_M2M_CLIENT_EDIT' : 'SUBSCRIBE_CLIENT_EDIT'

  return (
    <PageContainer
      isLoading={isLoading}
      title={operatorFullname}
      newTopSideActions={actions}
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
