import React from 'react'
import { Button, Stack } from '@mui/material'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { CreateClientFormValues } from '../ConsumerClientCreate.page'
import { Table, TableRow } from '@pagopa/interop-fe-commons'
import PlusOneIcon from '@mui/icons-material/PlusOne'
import { useDrawerState } from '@/hooks/useDrawerState'
import { AddOperatorsToClientDrawer } from '@/components/shared/AddOperatorsToClientDrawer'
import type { TenantUser } from '@/api/api.generatedTypes'

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
    const newOperators = operators.filter((o) => o.userId !== operatorId)
    setValue('operators', newOperators)
  }

  const handleAddOperator = (newOperators: Array<TenantUser>) => {
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
          <TableRow key={operator.userId} cellData={[`${operator.name} ${operator.familyName}`]}>
            <Button
              onClick={handleRemoveOperator.bind(null, operator.userId)}
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
      <AddOperatorsToClientDrawer
        isOpen={isAddOperatorDrawerOpen}
        onClose={closeAddOperatorDrawer}
        excludeOperatorsIdsList={operators.map(({ userId }) => userId)}
        onSubmit={handleAddOperator}
      />
    </>
  )
}

export default OperatorsInputTable
