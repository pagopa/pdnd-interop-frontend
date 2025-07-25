import { Button, Typography } from '@mui/material'
import { Table, TableRow } from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import PlusOneIcon from '@mui/icons-material/PlusOne'
import { useEServiceTemplateCreateContext } from '../ProviderEServiceTemplateContext'
import { TemplateMutations } from '@/api/template'
import { useDialog } from '@/stores'
import type { EServiceTemplateRiskAnalysis, TenantKind } from '@/api/api.generatedTypes'

export const EServiceTemplateCreateStepPurposeAddPurposesTable: React.FC<{
  onOpenAddRiskAnalysisForm: (selectedTenantKind: TenantKind) => void
  onOpenEditRiskAnalysisForm: (riskAnalysis: EServiceTemplateRiskAnalysis) => void
}> = ({ onOpenAddRiskAnalysisForm, onOpenEditRiskAnalysisForm }) => {
  const { t } = useTranslation('template', {
    keyPrefix: 'create.stepPurpose.purposeTableSection.purposeTable',
  })
  const { t: tCommon } = useTranslation('common')

  const { templateVersion, areEServiceTemplateGeneralInfoEditable } =
    useEServiceTemplateCreateContext()

  const { mutate: deleteRiskAnalysis } = TemplateMutations.useDeleteEServiceTemplateRiskAnalysis()

  const { openDialog } = useDialog()

  const handleAddNewPurpose = () => {
    openDialog({
      type: 'tenantKind',
      onConfirm: onOpenAddRiskAnalysisForm,
    })
  }

  const handleDeletePurpose = (riskAnalysisId: string) => {
    if (!templateVersion) return
    deleteRiskAnalysis({
      eServiceTemplateId: templateVersion.eserviceTemplate.id,
      riskAnalysisId: riskAnalysisId,
    })
  }

  return (
    <>
      <Table
        isEmpty={templateVersion?.eserviceTemplate.riskAnalysis.length === 0}
        headLabels={[]}
        noDataLabel={t('noDataLabel')}
      >
        {templateVersion?.eserviceTemplate.riskAnalysis.map((riskAnalysis) => (
          <TableRow
            key={riskAnalysis.id}
            cellData={[
              <Typography key={riskAnalysis.id} variant="body1" fontWeight={600}>
                {riskAnalysis.name}
              </Typography>,
            ]}
          >
            <Button
              onClick={() => onOpenEditRiskAnalysisForm(riskAnalysis)}
              disabled={!areEServiceTemplateGeneralInfoEditable}
              variant="naked"
              sx={{ mr: 3 }}
            >
              {tCommon('actions.edit')}
            </Button>
            <Button
              onClick={() => handleDeletePurpose(riskAnalysis.id)}
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
