import React from 'react'
import { PurposeQueries } from '@/api/purpose'
import { useQuery } from '@tanstack/react-query'
import { TemplateMutations, TemplateQueries } from '@/api/template'
import { useEServiceTemplateCreateContext } from '../../ProviderEServiceTemplateContext'
import {
  CreateStepPurposeRiskAnalysisForm,
  RiskAnalysisFormSkeleton,
} from '@/components/shared/CreateStepPurposeRiskAnalysisForm'

export const EServiceTemplateCreateStepPurposeRiskAnalysis: React.FC = () => {
  const {
    riskAnalysisFormState,
    closeRiskAnalysisForm,
    template: producerEserviceTemplate,
  } = useEServiceTemplateCreateContext()

  const templateId = producerEserviceTemplate?.id
  const versionTemplateId = producerEserviceTemplate?.draftVersion?.id

  const template =
    templateId && versionTemplateId
      ? useQuery(TemplateQueries.getSingle(templateId, versionTemplateId))
      : undefined

  const { mutate: addEServiceTemplateRiskAnalysis } = TemplateMutations.useAddTemplateRiskAnalysis()
  const { mutate: updateEServiceTemplateRiskAnalysis } =
    TemplateMutations.useUpdateTemplateRiskAnalysis()

  const { data: riskAnalysisLatest } = useQuery(
    PurposeQueries.getRiskAnalysisLatest({
      tenantKind: template?.data?.eserviceTemplate.creator.kind, //TODO CONTROLLARE
    })
  )

  if (!riskAnalysisLatest || !template?.data) return <RiskAnalysisFormSkeleton />

  const riskAnalysisToEdit = template?.data.eserviceTemplate.riskAnalysis.find(
    (item) => item.id === riskAnalysisFormState.riskAnalysisId
  )

  const handleCancel = () => {
    closeRiskAnalysisForm()
  }

  const handleSubmit = (name: string, answers: Record<string, string[]>) => {
    if (riskAnalysisFormState.riskAnalysisId && riskAnalysisToEdit) {
      updateEServiceTemplateRiskAnalysis(
        {
          eServiceTemplateId: templateId,
          riskAnalysisId: riskAnalysisFormState.riskAnalysisId,
          name: name,
          riskAnalysisForm: {
            version: riskAnalysisToEdit.riskAnalysisForm.version,
            answers: answers,
          },
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
          eServiceTemplateId: templateId,
          name: name,
          riskAnalysisForm: {
            version: riskAnalysisLatest.version,
            answers: answers,
          },
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
