import { Button, Typography } from '@mui/material'
import { Table, TableRow } from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import PlusOneIcon from '@mui/icons-material/PlusOne'
import { useEServiceCreateContext } from '../EServiceCreateContext'
import { EServiceMutations } from '@/api/eservice'

export const EServiceCreateStepPurposeAddPurposesTable: React.FC = () => {
  const { t } = useTranslation('eservice', {
    keyPrefix: 'create.stepPurpose.purposeTableSection.purposeTable',
  })
  const { t: tCommon } = useTranslation('common')

  const { descriptor, openRiskAnalysisForm, areEServiceGeneralInfoEditable } =
    useEServiceCreateContext()

  const { mutate: deleteRiskAnalysis } = EServiceMutations.useDeleteEServiceRiskAnalysis()

  const handleAddNewPurpose = () => {
    openRiskAnalysisForm()
  }

  const handleEditPurpose = (riskAnalysisId: string) => {
    openRiskAnalysisForm(riskAnalysisId)
  }

  const handleDeletePurpose = (riskAnalysisId: string) => {
    if (!descriptor) return
    deleteRiskAnalysis({ eserviceId: descriptor.eservice.id, riskAnalysisId: riskAnalysisId })
  }

  return (
    <>
      <Table
        isEmpty={descriptor?.eservice?.riskAnalysis.length === 0}
        headLabels={[]}
        noDataLabel={t('noDataLabel')}
      >
        {descriptor?.eservice?.riskAnalysis.map((riskAnalysis) => (
          <TableRow
            key={riskAnalysis.id}
            cellData={[
              <Typography key={riskAnalysis.id} variant="body1" fontWeight={600}>
                {riskAnalysis.name}
              </Typography>,
            ]}
          >
            <Button
              onClick={handleEditPurpose.bind(null, riskAnalysis.id)}
              disabled={!areEServiceGeneralInfoEditable}
              variant="naked"
              sx={{ mr: 3 }}
            >
              {tCommon('actions.edit')}
            </Button>
            <Button
              onClick={handleDeletePurpose.bind(null, riskAnalysis.id)}
              disabled={!areEServiceGeneralInfoEditable}
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
        disabled={!areEServiceGeneralInfoEditable}
        startIcon={<PlusOneIcon />}
        size="small"
        onClick={handleAddNewPurpose}
      >
        {tCommon('addBtn')}
      </Button>
    </>
  )
}
