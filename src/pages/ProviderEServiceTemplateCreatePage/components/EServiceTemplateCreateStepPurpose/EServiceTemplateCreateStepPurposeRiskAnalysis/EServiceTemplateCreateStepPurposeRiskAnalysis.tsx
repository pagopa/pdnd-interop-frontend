import React from 'react'
import { PurposeQueries } from '@/api/purpose'
import { useQuery } from '@tanstack/react-query'
import { TemplateMutations } from '@/api/template'
import { useEServiceTemplateCreateContext } from '../../ProviderEServiceTemplateContext'
import {
  CreateStepPurposeRiskAnalysisForm,
  RiskAnalysisFormSkeleton,
} from '@/components/shared/CreateStepPurposeRiskAnalysisForm'

export const EServiceTemplateCreateStepPurposeRiskAnalysis: React.FC = () => {
  const { riskAnalysisFormState, closeRiskAnalysisForm, templateVersion, tenantKind } =
    useEServiceTemplateCreateContext()

  const { mutate: addEServiceTemplateRiskAnalysis } =
    TemplateMutations.useAddEServiceTemplateRiskAnalysis()
  const { mutate: updateEServiceTemplateRiskAnalysis } =
    TemplateMutations.useUpdateEServiceTemplateRiskAnalysis()

  const { data: riskAnalysisLatest } = useQuery(
    PurposeQueries.getRiskAnalysisLatest({
      tenantKind: tenantKind,
    })
  )

  if (!riskAnalysisLatest || !templateVersion) return <RiskAnalysisFormSkeleton />

  const riskAnalysisToEdit = templateVersion.eserviceTemplate.riskAnalysis.find(
    (item) => item.id === riskAnalysisFormState.riskAnalysisId
  )

  const handleCancel = () => {
    closeRiskAnalysisForm()
  }

  const handleSubmit = (name: string, answers: Record<string, string[]>) => {
    if (riskAnalysisFormState.riskAnalysisId && riskAnalysisToEdit) {
      updateEServiceTemplateRiskAnalysis(
        {
          eServiceTemplateId: templateVersion.eserviceTemplate.id,
          riskAnalysisId: riskAnalysisFormState.riskAnalysisId,
          name: name,
          riskAnalysisForm: {
            version: riskAnalysisToEdit.riskAnalysisForm.version,
            answers: answers,
          },
          tenantKind: riskAnalysisToEdit.tenantKind,
        },
        {
          onSuccess() {
            closeRiskAnalysisForm()
          },
        }
      )
    }
    if (!riskAnalysisFormState.riskAnalysisId) {
      addEServiceTemplateRiskAnalysis(
        {
          eServiceTemplateId: templateVersion.eserviceTemplate.id,
          name: name,
          riskAnalysisForm: {
            version: riskAnalysisLatest.version,
            answers: answers,
          },
          tenantKind: tenantKind,
        },
        {
          onSuccess() {
            closeRiskAnalysisForm()
          },
        }
      )
    }
  }

  return (
    <CreateStepPurposeRiskAnalysisForm
      defaultName={riskAnalysisToEdit?.name}
      defaultAnswers={riskAnalysisToEdit?.riskAnalysisForm.answers}
      riskAnalysis={riskAnalysisLatest}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  )
}
