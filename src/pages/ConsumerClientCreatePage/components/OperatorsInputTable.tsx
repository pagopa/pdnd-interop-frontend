import React from 'react'
import { Button, Stack } from '@mui/material'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { CreateClientFormValues } from '../ConsumerClientCreate.page'
import { Table, TableRow } from '@pagopa/interop-fe-commons'
import type { RelationshipInfo } from '@/api/api.generatedTypes'
import PlusOneIcon from '@mui/icons-material/PlusOne'
import { AddOperatorsDrawer } from './AddOperatorsDrawer'
import { useDrawerState } from '@/hooks/useDrawerState'

const OperatorsInputTable: React.FC = () => {
  const { t } = useTranslation('client')
  const { t: tCommon } = useTranslation('common')

  const {
    isOpen: isAddOperatorDrawerOpen,
    openDrawer: openAddOperatorDrawer,
    closeDrawer: closeAddOperatorDrawer,
  } = useDrawerState()

  const { watch, setValue } = useFormContext<CreateClientFormValues>()
  const operators = watch('operators')

  const headLabels = [tCommon('table.headData.userName'), '']

  const handleRemoveOperator = (operatorId: string) => {
    const newOperators = operators.filter((o) => o.id !== operatorId)
    setValue('operators', newOperators)
  }

  const handleAddOperator = (newOperators: Array<RelationshipInfo>) => {
    setValue('operators', [...operators, ...newOperators])
  }

  const handleOpenAddOperatorDrawer = () => {
    openAddOperatorDrawer()
  }

  return (
    <>
      <Table
        isEmpty={operators.length === 0}
        headLabels={headLabels}
        noDataLabel={t('create.operatorsTable.noDataLabel')}
      >
        {operators.map((operator) => (
          <TableRow key={operator.id} cellData={[`${operator.name} ${operator.familyName}`]}>
            <Button
              onClick={handleRemoveOperator.bind(null, operator.id)}
              variant="naked"
              color="error"
            >
              {tCommon('actions.delete')}
            </Button>
          </TableRow>
        ))}
      </Table>
      <Stack direction="row" sx={{ my: 2 }}>
        <Button
          type="button"
          variant="contained"
          size="small"
          onClick={handleOpenAddOperatorDrawer}
          startIcon={<PlusOneIcon />}
        >
          {tCommon('addBtn')}
        </Button>
      </Stack>
      <AddOperatorsDrawer
        isOpen={isAddOperatorDrawerOpen}
        onClose={closeAddOperatorDrawer}
        excludeOperatorsIdsList={operators.map(({ id }) => id)}
        onSubmit={handleAddOperator}
      />
    </>
  )
}

export default OperatorsInputTable
