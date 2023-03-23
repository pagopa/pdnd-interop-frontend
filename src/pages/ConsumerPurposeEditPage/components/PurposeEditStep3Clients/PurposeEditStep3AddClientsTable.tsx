import React from 'react'
import { PurposeMutations, PurposeQueries } from '@/api/purpose'
import { Button, IconButton, Skeleton } from '@mui/material'
import { useTranslation } from 'react-i18next'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { useDialog } from '@/stores'
import { Table, TableRow } from '@pagopa/interop-fe-commons'

interface PurposeEditStep3AddClientsTableProps {
  purposeId: string
}

export const PurposeEditStep3AddClientsTable: React.FC<PurposeEditStep3AddClientsTableProps> = ({
  purposeId,
}) => {
  const { t } = useTranslation('purpose', { keyPrefix: 'edit' })
  const { t: tCommon } = useTranslation('common')
  const { openDialog } = useDialog()
  const { data: purpose } = PurposeQueries.useGetSingle(purposeId)
  const { mutate: removeClient } = PurposeMutations.useRemoveClient()

  const clients = purpose?.clients || []

  const handleRemoveClient = (clientId: string) => {
    removeClient({ purposeId, clientId })
  }

  const handleOpenAddClientDialog = () => {
    openDialog({ type: 'addClientToPurpose', purposeId })
  }

  const headLabels = [t('step3.tableHeadData.clientName'), '']

  return (
    <>
      <Table
        isEmpty={clients.length === 0}
        headLabels={headLabels}
        noDataLabel={t('step3.noDataLabel')}
      >
        {clients.map((client, i) => (
          <TableRow key={i} cellData={[client.name]}>
            <IconButton onClick={handleRemoveClient.bind(null, client.id)}>
              <DeleteOutlineIcon fontSize="small" color="error" />
            </IconButton>
          </TableRow>
        ))}
      </Table>
      <Button sx={{ mt: 2 }} variant="contained" size="small" onClick={handleOpenAddClientDialog}>
        {tCommon('addBtn')}
      </Button>
    </>
  )
}

export const PurposeEditStep3AddClientsTableSkeleton: React.FC = () => {
  const { t } = useTranslation('purpose', { keyPrefix: 'edit' })
  const headLabels = [t('step3.tableHeadData.clientName'), '']

  return (
    <Table headLabels={headLabels} noDataLabel={t('step3.noDataLabel')}>
      <TableRow cellData={[<Skeleton key={0} width={200} />]} />
      <TableRow cellData={[<Skeleton key={1} width={200} />]} />
      <TableRow cellData={[<Skeleton key={2} width={200} />]} />
    </Table>
  )
}
