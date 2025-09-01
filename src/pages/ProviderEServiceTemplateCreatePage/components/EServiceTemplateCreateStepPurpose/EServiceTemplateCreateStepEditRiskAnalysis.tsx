import React from 'react'
import { PurposeQueries } from '@/api/purpose'
import { useSuspenseQuery } from '@tanstack/react-query'
import { EServiceTemplateMutations } from '@/api/eserviceTemplate'
import { CreateStepPurposeRiskAnalysisForm } from '@/components/shared/CreateStepPurposeRiskAnalysisForm'
import type { EServiceTemplateRiskAnalysis } from '@/api/api.generatedTypes'

export const EServiceTemplateCreateStepEditRiskAnalysis: React.FC<{
  eserviceTemplateId: string
  riskAnalysis: EServiceTemplateRiskAnalysis
  onClose: () => void
}> = ({ eserviceTemplateId, riskAnalysis, onClose }) => {
  const { mutate: updateEServiceTemplateRiskAnalysis } =
    EServiceTemplateMutations.useUpdateEServiceTemplateRiskAnalysis()

  const { data: riskAnalysisLatest } = useSuspenseQuery(
    PurposeQueries.getRiskAnalysisLatest({
      tenantKind: riskAnalysis.tenantKind,
    })
  )

  const handleClose = () => {
    onClose()
  }

  const handleSubmit = (name: string, answers: Record<string, string[]>) => {
    updateEServiceTemplateRiskAnalysis(
      {
        eServiceTemplateId: eserviceTemplateId,
        riskAnalysisId: riskAnalysis.id,
        name: name,
        riskAnalysisForm: {
          version: riskAnalysis.riskAnalysisForm.version,
          answers: answers,
        },
        tenantKind: riskAnalysis.tenantKind,
      },
      { onSuccess: handleClose }
    )
  }

  return (
    <CreateStepPurposeRiskAnalysisForm
      defaultName={riskAnalysis.name}
      defaultAnswers={riskAnalysis.riskAnalysisForm.answers}
      riskAnalysis={riskAnalysisLatest}
      onSubmit={handleSubmit}
      onCancel={handleClose}
    />
  )
}
