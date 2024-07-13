import React from 'react'
import { StatusChip, StatusChipSkeleton } from '@/components/shared/StatusChip'
import { Box, Skeleton, Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { URL_FRAGMENTS } from '@/router/router.utils'
import { ActionMenu, ActionMenuSkeleton } from '@/components/shared/ActionMenu'
import { ButtonSkeleton } from '@/components/shared/MUI-skeletons'
import { useGetProviderEServiceActions } from '@/hooks/useGetProviderEServiceActions'
import { TableRow } from '@pagopa/interop-fe-commons'
import type { ProducerEService } from '@/api/api.generatedTypes'
import { RouterButton } from '@/components/shared/RouterButton'
import { useAuthenticatedUser } from '@/hooks/useAuthenticatedUser'

type EServiceTableRow = {
  eservice: ProducerEService
}

export const EServiceTableRow: React.FC<EServiceTableRow> = ({ eservice }) => {
  const { t } = useTranslation('common')
  const { isAdmin, isOperatorAPI } = useAuthenticatedUser()

  const { actions } = useGetProviderEServiceActions(
    eservice.id,
    eservice.activeDescriptor?.state,
    eservice.activeDescriptor?.id,
    eservice.draftDescriptor?.id,
    eservice.mode
  )

  const isEServiceInDraft = !eservice.activeDescriptor
  const isEServiceEditable = (isAdmin || isOperatorAPI) && isEServiceInDraft

  return (
    <TableRow
      cellData={[
        eservice.name,
        eservice?.activeDescriptor?.version || '1',
        <Stack key={eservice?.id} direction="row" spacing={1}>
          {eservice?.activeDescriptor && (
            <StatusChip for="eservice" state={eservice.activeDescriptor.state} />
          )}
          {(isEServiceInDraft || eservice?.draftDescriptor) && (
            <StatusChip for="eservice" state={'DRAFT'} />
          )}
        </Stack>,
      ]}
    >
      <RouterButton
        variant="outlined"
        size="small"
        to={
          isEServiceEditable
            ? '/erogazione/e-service/$eserviceId/$descriptorId/modifica/riepilogo'
            : '/erogazione/e-service/$eserviceId/$descriptorId'
        }
        params={{
          eserviceId: eservice.id,
          descriptorId:
            eservice?.activeDescriptor?.id ||
            eservice?.draftDescriptor?.id ||
            URL_FRAGMENTS.FIRST_DRAFT,
        }}
      >
        {t(`actions.${isEServiceEditable ? 'manageDraft' : 'inspect'}`)}
      </RouterButton>

      <Box component="span" sx={{ ml: 2, display: 'inline-block' }}>
        <ActionMenu actions={actions} />
      </Box>
    </TableRow>
  )
}

export const EServiceTableRowSkeleton: React.FC = () => {
  return (
    <TableRow
      cellData={[
        <Skeleton key={0} width={220} />,
        <Skeleton key={1} width={20} />,
        <StatusChipSkeleton key={2} />,
      ]}
    >
      <ButtonSkeleton size="small" width={100} />
      <ActionMenuSkeleton />
    </TableRow>
  )
}
