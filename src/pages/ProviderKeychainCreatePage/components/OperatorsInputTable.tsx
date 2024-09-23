import React from 'react'
import { Button, Stack } from '@mui/material'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { CreateKeychainFormValues } from '../ProviderKeychainCreate.page'
import { Table, TableRow } from '@pagopa/interop-fe-commons'
import PlusOneIcon from '@mui/icons-material/PlusOne'
import { useDrawerState } from '@/hooks/useDrawerState'
import type { Users } from '@/api/api.generatedTypes'
import { useCurrentRoute } from '@/router'
import { AddOperatorsDrawer } from '@/components/shared/AddOperatorsDrawer'

const OperatorsInputTable: React.FC = () => {
  const { t } = useTranslation('client')
  const { t: tCommon } = useTranslation('common')

  const {
    isOpen: isAddOperatorDrawerOpen,
    openDrawer: openAddOperatorDrawer,
    closeDrawer: closeAddOperatorDrawer,
  } = useDrawerState()

  const { watch, setValue } = useFormContext<CreateKeychainFormValues>()
  const operators = watch('operators')

  const headLabels = [tCommon('table.headData.userName'), '']

  const handleRemoveOperator = (operatorId: string) => {
    const newOperators = operators.filter((o) => o.userId !== operatorId)
    setValue('operators', newOperators)
  }

  const handleAddOperator = (newOperators: Users) => {
    setValue('operators', [...operators, ...newOperators])
  }

  const handleOpenAddOperatorDrawer = () => {
    openAddOperatorDrawer()
  }

  const { routeKey } = useCurrentRoute()

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
      <AddOperatorsDrawer
        isOpen={isAddOperatorDrawerOpen}
        onClose={closeAddOperatorDrawer}
        excludeOperatorsIdsList={operators.map(({ userId }) => userId)}
        onSubmit={handleAddOperator}
        operatorKind="keychain"
      />
    </>
  )
}

export default OperatorsInputTable
