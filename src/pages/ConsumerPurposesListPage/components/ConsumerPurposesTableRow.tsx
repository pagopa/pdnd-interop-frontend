import { PurposeQueries } from '@/api/purpose'
import ActionMenu from '@/components/shared/ActionMenu'
import { StatusChip, StatusChipSkeleton } from '@/components/shared/StatusChip'
import { TableRow } from '@/components/shared/Table'
import useGetPurposesActions from '@/hooks/useGetPurposesActions'
import { useNavigateRouter } from '@/router'
import { DecoratedPurpose } from '@/types/purpose.types'
import { Box, Button, Skeleton, Stack } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

export const ConsumerPurposesTableRow: React.FC<{ purpose: DecoratedPurpose }> = ({ purpose }) => {
  const { navigate } = useNavigateRouter()
  const { t } = useTranslation('common')
  const prefetch = PurposeQueries.usePrefetchSingle()

  const { actions } = useGetPurposesActions(purpose)

  const isPurposeEditable = !purpose.currentVersion || purpose.currentVersion.state === 'DRAFT'

  const goToEditOrInspectPurpose = () => {
    const path = isPurposeEditable ? 'SUBSCRIBE_PURPOSE_EDIT' : 'SUBSCRIBE_PURPOSE_VIEW'
    navigate(path, { params: { purposeId: purpose.id } })
  }

  const handlePrefetch = () => {
    prefetch(purpose.id)
  }

  return (
    <TableRow
      cellData={[
        { label: purpose.title },
        { label: purpose.eservice.name },
        { label: purpose.eservice.producer.name },
        {
          custom: (
            <>
              <StatusChip
                for="purpose"
                state={purpose.currentVersion ? purpose.currentVersion.state : 'DRAFT'}
              />
              {purpose.awaitingApproval && (
                <StatusChip for="purpose" sx={{ ml: 1 }} state="WAITING_FOR_APPROVAL" />
              )}
            </>
          ),
        },
      ]}
    >
      <Button
        onPointerEnter={handlePrefetch}
        onFocusVisible={handlePrefetch}
        variant="outlined"
        size="small"
        onClick={goToEditOrInspectPurpose}
      >
        {t(`actions.${isPurposeEditable ? 'edit' : 'inspect'}`)}
      </Button>

      <Box component="span" sx={{ ml: 2, display: 'inline-block' }}>
        <ActionMenu actions={actions} />
      </Box>
    </TableRow>
  )
}

export const ConsumerPurposesTableRowSkeleton: React.FC = () => {
  return (
    <TableRow
      cellData={[
        { label: <Skeleton width={180} /> },
        { label: <Skeleton width={180} /> },
        { label: <Skeleton width={180} /> },
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
