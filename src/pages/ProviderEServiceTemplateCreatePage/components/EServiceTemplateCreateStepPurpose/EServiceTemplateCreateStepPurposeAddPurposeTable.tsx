import { Button, Typography } from '@mui/material'
import { Table, TableRow } from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import PlusOneIcon from '@mui/icons-material/PlusOne'
import { useEServiceTemplateCreateContext } from '../ProviderEServiceTemplateContext'
import { TemplateMutations } from '@/api/template'

export const EServiceTemplateCreateStepPurposeAddPurposesTable: React.FC = () => {
  const { t } = useTranslation('template', {
    keyPrefix: 'create.stepPurpose.purposeTableSection.purposeTable',
  })
  const { t: tCommon } = useTranslation('common')

  const { template, openRiskAnalysisForm, areEServiceTemplateGeneralInfoEditable } =
    useEServiceTemplateCreateContext()

  const { mutate: deleteRiskAnalysis } = TemplateMutations.useDeleteTemplateRiskAnalysis()

  const handleAddNewPurpose = () => {
    openRiskAnalysisForm()
  }

  const handleEditPurpose = (riskAnalysisId: string) => {
    openRiskAnalysisForm(riskAnalysisId)
  }

  const handleDeletePurpose = (riskAnalysisId: string) => {
    if (!template) return
    deleteRiskAnalysis({ eServiceTemplateId: template.id, riskAnalysisId: riskAnalysisId })
  }

  return (
    <>
      <Table
        isEmpty={template?.eserviceTemplate.riskAnalysis.length === 0}
        headLabels={[]}
        noDataLabel={t('noDataLabel')}
      >
        {template?.eserviceTemplate.riskAnalysis.map((riskAnalysis) => (
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
              disabled={!areEServiceTemplateGeneralInfoEditable}
              variant="naked"
              sx={{ mr: 3 }}
            >
              {tCommon('actions.edit')}
            </Button>
            <Button
              onClick={handleDeletePurpose.bind(null, riskAnalysis.id)}
              disabled={!areEServiceTemplateGeneralInfoEditable}
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
        disabled={!areEServiceTemplateGeneralInfoEditable}
        startIcon={<PlusOneIcon />}
        size="small"
        onClick={handleAddNewPurpose}
      >
        {tCommon('addBtn')}
      </Button>
    </>
  )
}
