import { useDialog } from '@/stores'
import { Alert, Button, Stack, Tooltip } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { PurposeClientsTable, PurposeClientsTableSkeleton } from './PurposeClientsTable'
import { AuthHooks } from '@/api/auth'
import PlusOneIcon from '@mui/icons-material/PlusOne'

interface PurposeClientsTabProps {
  purposeId: string
  isPurposeArchived: boolean
}

export const PurposeClientsTab: React.FC<PurposeClientsTabProps> = ({
  purposeId,
  isPurposeArchived,
}) => {
  const { t } = useTranslation('purpose')
  const { t: tCommon } = useTranslation('common')
  const { openDialog } = useDialog()
  const { isAdmin } = AuthHooks.useJwt()

  const handleOpenAddClientToPurposeDialog = () => {
    openDialog({ type: 'addClientToPurpose', purposeId })
  }

  if (isPurposeArchived)
    return <Alert severity="info">{t('consumerView.archivedPurposeClientsAlert')}</Alert>

  return (
    <>
      <Stack sx={{ mb: 2 }} alignItems="end">
        <Tooltip
          arrow
          title={isAdmin ? undefined : t('consumerView.addClientToPurposeDisableTooltip.label')}
        >
          <Button
            variant="contained"
            size="small"
            onClick={handleOpenAddClientToPurposeDialog}
            startIcon={<PlusOneIcon />}
            disabled={!isAdmin}
          >
            {tCommon('addBtn')}
          </Button>
        </Tooltip>
      </Stack>
      <React.Suspense fallback={<PurposeClientsTableSkeleton />}>
        <PurposeClientsTable purposeId={purposeId} />
      </React.Suspense>
    </>
  )
}
