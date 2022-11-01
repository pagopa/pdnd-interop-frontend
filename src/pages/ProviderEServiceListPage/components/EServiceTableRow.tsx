import React from 'react'
import { TableRow } from '@/components/shared/Table'
import { StatusChip, StatusChipSkeleton } from '@/components/shared/StatusChip'
import { Box, Button, Skeleton, Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useNavigateRouter } from '@/router'
import { URL_FRAGMENTS } from '@/router/utils'
import useCurrentLanguage from '@/hooks/useCurrentLanguage'
import useGetEServiceProviderActions from '@/hooks/useGetEServiceProviderActions'
import ActionMenu from '@/components/shared/ActionMenu'
import { EServiceFlatten } from '@/types/eservice.types'
import { EServiceQueries } from '@/api/eservice'

type EServiceTableRow = {
  eservice: EServiceFlatten
}

export const EServiceTableRow: React.FC<EServiceTableRow> = ({ eservice }) => {
  const { navigate } = useNavigateRouter()
  const { t } = useTranslation('common')
  const lang = useCurrentLanguage()
  const prefetch = EServiceQueries.usePrefetchSingle()

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
      <Stack direction="row" sx={{ display: 'inline-flex' }}>
        <Skeleton sx={{ borderRadius: 1 }} variant="rectangular" width={100} height={35} />

        <Box
          sx={{
            ml: 4,
            mr: 2,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Skeleton variant="rectangular" width={4} />
        </Box>
      </Stack>
    </TableRow>
  )
}
