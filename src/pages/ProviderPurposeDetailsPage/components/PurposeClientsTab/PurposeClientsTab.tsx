import { useDialog } from '@/contexts'
import { Button, Stack } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { PurposeClientsTable, PurposeClientsTableSkeleton } from './PurposeClientsTable'

interface PurposeClientsTabProps {
  purposeId: string
}

export const PurposeClientsTab: React.FC<PurposeClientsTabProps> = ({ purposeId }) => {
  const { t } = useTranslation('common')
  const { openDialog } = useDialog()

  const handleOpenAddClientToPurposeDialog = () => {
    openDialog({ type: 'addClientToPurpose', purposeId })
  }

  return (
    <>
      <Stack sx={{ mb: 2 }} alignItems="end">
        <Button variant="contained" size="small" onClick={handleOpenAddClientToPurposeDialog}>
          {t('addBtn')}
        </Button>
      </Stack>
      <React.Suspense fallback={<PurposeClientsTableSkeleton />}>
        <PurposeClientsTable purposeId={purposeId} />
      </React.Suspense>
    </>
  )
}
