import React from 'react'
import { Table, TableRow } from '@/components/shared/Table'
import { Button, IconButton, Stack } from '@mui/material'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { CreateClientFormValues } from '../ConsumerClientCreate.page'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { useDialog } from '@/stores'
import type { SelfCareUser } from '@/types/party.types'

const OperatorsInputTable: React.FC = () => {
  const { t } = useTranslation('client')
  const { t: tCommon } = useTranslation('common')
  const { openDialog } = useDialog()

  const { watch, setValue } = useFormContext<CreateClientFormValues>()
  const operators = watch('operators')

  const headLabels = [tCommon('table.headData.userName'), '']

  const handleRemoveOperator = (operatorId: string) => {
    const newOperators = operators.filter((o) => o.id !== operatorId)
    setValue('operators', newOperators)
  }

  const handleAddOperator = (newOperators: Array<SelfCareUser>) => {
    setValue('operators', [...operators, ...newOperators])
  }

  const handleAddOperatorDialog = () => {
    openDialog({
      type: 'addSecurityOperator',
      excludeOperatorsIdsList: operators.map(({ id }) => id),
      onSubmit: handleAddOperator,
    })
  }

  return (
    <>
      <Table
        isEmpty={operators.length === 0}
        headLabels={headLabels}
        noDataLabel={t('create.operatorsTable.noDataLabel')}
      >
        {operators.map((operator) => (
          <TableRow
            key={operator.id}
            cellData={[{ label: `${operator.name} ${operator.familyName}` }]}
          >
            <IconButton onClick={handleRemoveOperator.bind(null, operator.id)}>
              <DeleteOutlineIcon color="error" fontSize="small" />
            </IconButton>
          </TableRow>
        ))}
      </Table>
      <Stack direction="row" sx={{ my: 2 }}>
        <Button type="button" variant="contained" size="small" onClick={handleAddOperatorDialog}>
          {tCommon('addBtn')}
        </Button>
      </Stack>
    </>
  )
}

export default OperatorsInputTable
