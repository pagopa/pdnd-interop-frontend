import React from 'react'
import { TableRow } from '@/components/shared/Table'
import { StatusChip, StatusChipSkeleton } from '@/components/shared/StatusChip'
import { Box, Button, Skeleton } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useNavigateRouter } from '@/router'
import { URL_FRAGMENTS } from '@/router/utils'
import useCurrentLanguage from '@/hooks/useCurrentLanguage'
import useGetEServiceProviderActions from '@/hooks/useGetEServiceProviderActions'
import { ActionMenu, ActionMenuSkeleton } from '@/components/shared/ActionMenu'
import { EServiceFlatten } from '@/types/eservice.types'
import { EServiceQueries } from '@/api/eservice'
import { ButtonSkeleton } from '@/components/shared/MUISkeletons'

type EServiceTableRow = {
  eservice: EServiceFlatten
}

export const EServiceTableRow: React.FC<EServiceTableRow> = ({ eservice }) => {
  const { navigate } = useNavigateRouter()
  const { t } = useTranslation('common')
  const lang = useCurrentLanguage()
  const prefetch = EServiceQueries.usePrefetchDescriptorProvider()

  const { actions } = useGetEServiceProviderActions({
    eserviceId: eservice.id,
    descriptorId: eservice?.descriptorId,
    state: eservice.state,
  })

  const handleEditOrInspect = () => {
    const destPath =
      !eservice.state || eservice.state === 'DRAFT'
        ? 'PROVIDE_ESERVICE_EDIT'
        : 'PROVIDE_ESERVICE_MANAGE'

    navigate(destPath, {
      params: {
        eserviceId: eservice.id,
        descriptorId: eservice.descriptorId || URL_FRAGMENTS.FIRST_DRAFT[lang],
      },
    })
  }

  const handlePrefetch = () => {
    if (!eservice.descriptorId) return
    prefetch(eservice.id, eservice.descriptorId)
  }

  return (
    <TableRow
      cellData={[
        { label: eservice.name },
        { label: eservice.version || '1' },
        {
          custom: <StatusChip for="eservice" state={eservice.state || 'DRAFT'} />,
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
        {t(`actions.${!eservice.state || eservice.state === 'DRAFT' ? 'edit' : 'inspect'}`)}
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
