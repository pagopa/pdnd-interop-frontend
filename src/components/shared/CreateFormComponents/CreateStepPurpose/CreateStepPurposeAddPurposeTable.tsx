import { Button, Typography } from '@mui/material'
import { Table, TableRow } from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import PlusOneIcon from '@mui/icons-material/PlusOne'
import { EServiceMutations } from '@/api/eservice'
import { useCreateContext } from '../../CreateContext'
import { TemplateMutations } from '@/api/template'

export const CreateStepPurposeAddPurposesTable: React.FC = () => {
  const { t } = useTranslation('eservice', {
    //TODO
    keyPrefix: 'create.stepPurpose.purposeTableSection.purposeTable',
  })
  const { t: tCommon } = useTranslation('common')

  const { descriptor, template, openRiskAnalysisForm, areGeneralInfoEditable } = useCreateContext()

  const { mutate: deleteEServiceRiskAnalysis } = EServiceMutations.useDeleteEServiceRiskAnalysis()
  const { mutate: deleteTemplateRiskAnalysis } = TemplateMutations.useDeleteTemplateRiskAnalysis()

  const handleAddNewPurpose = () => {
    openRiskAnalysisForm()
  }

  const handleEditPurpose = (riskAnalysisId: string) => {
    openRiskAnalysisForm(riskAnalysisId)
  }

  const handleDeletePurpose = (riskAnalysisId: string) => {
    if (!descriptor && !template) return //TODO
    if (descriptor) {
      deleteEServiceRiskAnalysis({
        eserviceId: descriptor.eservice.id,
        riskAnalysisId: riskAnalysisId,
      })
    }
    if (template) {
      deleteTemplateRiskAnalysis({
        eserviceTemplateId: template.eservice.id,
        riskAnalysisId: riskAnalysisId,
      })
    }
  }

  return (
    <>
      <Table
        isEmpty={
          descriptor?.eservice?.riskAnalysis.length === 0 ||
          template?.eservice?.riskAnalysis.length === 0
        }
        headLabels={[]}
        noDataLabel={t('noDataLabel')}
      >
        {descriptor &&
          descriptor?.eservice?.riskAnalysis.map((riskAnalysis) => (
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
                disabled={!areGeneralInfoEditable}
                variant="naked"
                sx={{ mr: 3 }}
              >
                {tCommon('actions.edit')}
              </Button>
              <Button
                onClick={handleDeletePurpose.bind(null, riskAnalysis.id)}
                disabled={!areGeneralInfoEditable}
                variant="naked"
                color="error"
              >
                {tCommon('actions.delete')}
              </Button>
            </TableRow>
          ))}
        {template &&
          template?.eservice?.riskAnalysis.map((riskAnalysis) => (
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
                disabled={!areGeneralInfoEditable}
                variant="naked"
                sx={{ mr: 3 }}
              >
                {tCommon('actions.edit')}
              </Button>
              <Button
                onClick={handleDeletePurpose.bind(null, riskAnalysis.id)}
                disabled={!areGeneralInfoEditable}
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
        disabled={!areGeneralInfoEditable}
        startIcon={<PlusOneIcon />}
        size="small"
        onClick={handleAddNewPurpose}
      >
        {tCommon('addBtn')}
      </Button>
    </>
  )
}
