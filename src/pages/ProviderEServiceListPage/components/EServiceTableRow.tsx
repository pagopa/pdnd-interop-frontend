import React from 'react'
import { TableRow } from '@/components/shared/Table'
import { StatusChip, StatusChipSkeleton } from '@/components/shared/StatusChip'
import { Box, Button, Skeleton, Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useNavigateRouter } from '@/router'
import { URL_FRAGMENTS } from '@/router/router.utils'
import useCurrentLanguage from '@/hooks/useCurrentLanguage'
import { ActionMenu, ActionMenuSkeleton } from '@/components/shared/ActionMenu'
import type { EServiceProvider } from '@/types/eservice.types'
import { EServiceQueries } from '@/api/eservice'
import { ButtonSkeleton } from '@/components/shared/MUI-skeletons'
import { useGetProviderEServiceActions } from '@/hooks/useGetProviderEServiceActions'

type EServiceTableRow = {
  eservice: EServiceProvider
}

export const EServiceTableRow: React.FC<EServiceTableRow> = ({ eservice }) => {
  const { navigate } = useNavigateRouter()
  const { t } = useTranslation('common')
  const lang = useCurrentLanguage()
  const prefetchDescriptor = EServiceQueries.usePrefetchDescriptorProvider()
  const prefetchEService = EServiceQueries.usePrefetchSingle()

  const { actions } = useGetProviderEServiceActions(
    eservice.id,
    eservice.activeDescriptor?.state,
    eservice.activeDescriptor?.id,
    eservice.draftDescriptor?.id
  )

  const isEServiceInDraft = !eservice.activeDescriptor

  const handleEditOrInspect = () => {
    const destPath = isEServiceInDraft ? 'PROVIDE_ESERVICE_EDIT' : 'PROVIDE_ESERVICE_MANAGE'

    navigate(destPath, {
      params: {
        eserviceId: eservice.id,
        descriptorId:
          eservice?.activeDescriptor?.id ||
          eservice?.draftDescriptor?.id ||
          URL_FRAGMENTS.FIRST_DRAFT[lang],
      },
    })
  }

  const handlePrefetch = () => {
    if (isEServiceInDraft) {
      prefetchEService(eservice.id)
      return
    }
    if (!eservice.activeDescriptor) return
    prefetchDescriptor(eservice.id, eservice.activeDescriptor.id)
  }

  return (
    <TableRow
      cellData={[
        { label: eservice.name },
        { label: eservice?.activeDescriptor?.version || '1' },
        {
          custom: (
            <Stack direction="row" spacing={1}>
              {eservice?.activeDescriptor && (
                <StatusChip for="eservice" state={eservice.activeDescriptor.state} />
              )}
              {(isEServiceInDraft || eservice?.draftDescriptor) && (
                <StatusChip for="eservice" state={'DRAFT'} />
              )}
            </Stack>
          ),
        },
      ]}
    >
      <Button
        onPointerEnter={handlePrefetch}
        onFocusVisible={handlePrefetch}
        variant="outlined"
        size="small"
        onClick={handleEditOrInspect}
      >
        {t(`actions.${isEServiceInDraft ? 'edit' : 'inspect'}`)}
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
        { label: <Skeleton width={220} /> },
        { label: <Skeleton width={20} /> },
        {
          custom: <StatusChipSkeleton />,
        },
      ]}
    >
      <ButtonSkeleton size="small" width={100} />
      <ActionMenuSkeleton />
    </TableRow>
  )
}
