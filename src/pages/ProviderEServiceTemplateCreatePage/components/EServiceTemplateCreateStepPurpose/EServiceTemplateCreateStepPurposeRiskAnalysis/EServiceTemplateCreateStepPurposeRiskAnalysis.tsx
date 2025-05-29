import React from 'react'
import { PurposeQueries } from '@/api/purpose'
import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { TemplateMutations, TemplateQueries } from '@/api/template'
import { useEServiceTemplateCreateContext } from '../../ProviderEServiceTemplateContext'
import {
  CreateStepPurposeRiskAnalysisForm,
  RiskAnalysisFormSkeleton,
} from '@/components/shared/CreateStepPurposeRiskAnalysisForm'
import { TenantKind } from '@/api/api.generatedTypes'

export const EServiceTemplateCreateStepPurposeRiskAnalysis: React.FC = () => {
  const { riskAnalysisFormState, closeRiskAnalysisForm, template, tenantKind } =
    useEServiceTemplateCreateContext()

  const { mutate: addEServiceTemplateRiskAnalysis } = TemplateMutations.useAddTemplateRiskAnalysis()
  const { mutate: updateEServiceTemplateRiskAnalysis } =
    TemplateMutations.useUpdateTemplateRiskAnalysis()

  const { data: riskAnalysisLatest } = useQuery(
    PurposeQueries.getRiskAnalysisLatest({
      tenantKind: tenantKind,
    })
  )

  if (!riskAnalysisLatest || !template) return <RiskAnalysisFormSkeleton />

  const riskAnalysisToEdit = template.eserviceTemplate.riskAnalysis.find(
    (item) => item.id === riskAnalysisFormState.riskAnalysisId
  )

  const handleCancel = () => {
    closeRiskAnalysisForm()
  }

  // TODO: UpdateRiskAnalysis (RECEIVE MODE) is not available yet
  const handleSubmit = (
    name: string,
    answers: Record<string, string[]>
    // tenantKind: TenantKind
  ) => {
    // if (riskAnalysisFormState.riskAnalysisId && riskAnalysisToEdit) {
    //   updateEServiceTemplateRiskAnalysis(
    //     {
    //       eServiceTemplateId: template.id,
    //       riskAnalysisId: riskAnalysisFormState.riskAnalysisId,
    //       name: name,
    //       riskAnalysisForm: {
    //         version: riskAnalysisToEdit.riskAnalysisForm.version,
    //         answers: answers,
    //       },
    //       tenantKind: riskAnalysisToEdit.tenantKind,
    //     },
    //     {
    //       onSuccess() {
    //         closeRiskAnalysisForm()
    //       },
    //     }
    //   )
    // }
    // if (!riskAnalysisFormState.riskAnalysisId) {
    //   addEServiceTemplateRiskAnalysis(
    //     {
    //       eServiceTemplateId: template.id,
    //       name: name,
    //       riskAnalysisForm: {
    //         version: riskAnalysisLatest.version,
    //         answers: answers,
    //       },
    //       tenantKind: tenantKind,
    //     },
    //     {
    //       onSuccess() {
    //         closeRiskAnalysisForm()
    //       },
    //     }
    //   )
    // }
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
