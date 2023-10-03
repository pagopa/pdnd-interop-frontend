import { Button } from '@mui/material'
import { Table, TableRow } from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import PlusOneIcon from '@mui/icons-material/PlusOne'
import { useEServiceCreateContext } from '../EServiceCreateContext'

/**
 * TODO remove when BE is updated
 */
// const purposes = []
const purposes = [{ name: 'mock1' }]

export const EServiceCreateStepPurposeAddPurposesTable: React.FC = () => {
  const { t: tCommon } = useTranslation('common')

  const { eservice, openRiskAnalysisForm } = useEServiceCreateContext()

  const headLabels = ['TODO purposes', '']
  // const headLabels = []

  const handleAddNewPurpose = () => {
    console.log('TODO function to add new purpose')
    openRiskAnalysisForm()
  }

  return (
    <>
      <Table
        isEmpty={eservice?.riskAnalysis.length === 0}
        headLabels={headLabels}
        noDataLabel={'TODO Nessuna finalità aggiunta'}
      >
        {eservice?.riskAnalysis.map((purpose, i) => (
          <TableRow key={purpose.id} cellData={[purpose.name]}>
            <Button
              onClick={() => console.log('TODO function to edit purpose')}
              variant="naked"
              sx={{ mr: 3 }}
            >
              {tCommon('actions.edit')}
            </Button>
            <Button
              onClick={() => console.log('TODO function to remove purpose from list')}
              variant="naked"
              color="error"
            >
              {tCommon('actions.delete')}
            </Button>
          </TableRow>
        ))}
      </Table>
      <Button
        sx={{ mt: 2 }}
        variant="contained"
        startIcon={<PlusOneIcon />}
        size="small"
        onClick={handleAddNewPurpose}
      >
        {tCommon('addBtn')}
      </Button>
    </>
  )
}
