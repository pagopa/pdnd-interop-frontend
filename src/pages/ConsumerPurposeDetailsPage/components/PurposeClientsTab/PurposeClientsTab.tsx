import { useDialog } from '@/stores'
import { Alert, Button, Stack } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { PurposeClientsTable, PurposeClientsTableSkeleton } from './PurposeClientsTable'
import { AuthHooks } from '@/api/auth'

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

  if (isPurposeArchived) return <Alert severity="info">{t('view.archivedPurposeAlert')}</Alert>

  return (
    <>
      {isAdmin && (
        <Stack sx={{ mb: 2 }} alignItems="end">
          <Button variant="contained" size="small" onClick={handleOpenAddClientToPurposeDialog}>
            {tCommon('addBtn')}
          </Button>
        </Stack>
      )}
      <React.Suspense fallback={<PurposeClientsTableSkeleton />}>
        <PurposeClientsTable purposeId={purposeId} />
      </React.Suspense>
    </>
  )
}
