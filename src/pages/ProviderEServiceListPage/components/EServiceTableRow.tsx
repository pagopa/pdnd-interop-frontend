import React from 'react'
import { StatusChip, StatusChipSkeleton } from '@/components/shared/StatusChip'
import { Box, Button, Skeleton, Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useNavigate } from '@/router'
import { URL_FRAGMENTS } from '@/router/router.utils'
import { ActionMenu, ActionMenuSkeleton } from '@/components/shared/ActionMenu'
import { EServiceQueries } from '@/api/eservice'
import { ButtonSkeleton } from '@/components/shared/MUI-skeletons'
import { useGetProviderEServiceActions } from '@/hooks/useGetProviderEServiceActions'
import { useJwt } from '@/hooks/useJwt'
import { TableRow } from '@pagopa/interop-fe-commons'
import type { ProducerEService } from '@/api/api.generatedTypes'

type EServiceTableRow = {
  eservice: ProducerEService
}

export const EServiceTableRow: React.FC<EServiceTableRow> = ({ eservice }) => {
  const navigate = useNavigate()
  const { t } = useTranslation('common')
  const { isAdmin, isOperatorAPI } = useJwt()

  const prefetchDescriptor = EServiceQueries.usePrefetchDescriptorProvider()
  const prefetchEService = EServiceQueries.usePrefetchSingle()

  const { actions } = useGetProviderEServiceActions(
    eservice.id,
    eservice.activeDescriptor?.state,
    eservice.activeDescriptor?.id,
    eservice.draftDescriptor?.id
  )

  const isEServiceInDraft = !eservice.activeDescriptor
  const isEServiceEditable = (isAdmin || isOperatorAPI) && isEServiceInDraft

  const handleEditOrInspect = () => {
    const destPath = isEServiceEditable ? 'PROVIDE_ESERVICE_EDIT' : 'PROVIDE_ESERVICE_MANAGE'

    navigate(destPath, {
      params: {
        eserviceId: eservice.id,
        descriptorId:
          eservice?.activeDescriptor?.id ||
          eservice?.draftDescriptor?.id ||
          URL_FRAGMENTS.FIRST_DRAFT,
      },
    })
  }

  const handlePrefetch = () => {
    if (isEServiceEditable) {
      prefetchEService(eservice.id)
      return
    }
    if (!eservice.activeDescriptor) return
    prefetchDescriptor(eservice.id, eservice.activeDescriptor.id)
  }

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
      <Button
        onPointerEnter={handlePrefetch}
        onFocusVisible={handlePrefetch}
        variant="outlined"
        size="small"
        onClick={handleEditOrInspect}
      >
        {t(`actions.${isEServiceEditable ? 'edit' : 'inspect'}`)}
      </Button>

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
