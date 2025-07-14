import React from 'react'
import { PurposeQueries } from '@/api/purpose'
import { useSuspenseQuery } from '@tanstack/react-query'
import { TemplateMutations } from '@/api/template'
import { CreateStepPurposeRiskAnalysisForm } from '@/components/shared/CreateStepPurposeRiskAnalysisForm'
import type { TenantKind } from '@/api/api.generatedTypes'

export const EServiceTemplateCreateStepAddRiskAnalysis: React.FC<{
  eserviceTemplateId: string
  selectedTenantKind: TenantKind
  onClose: () => void
}> = ({ eserviceTemplateId, selectedTenantKind, onClose }) => {
  const { mutate: addEServiceTemplateRiskAnalysis } =
    TemplateMutations.useAddEServiceTemplateRiskAnalysis()

  const { data: riskAnalysisLatest } = useSuspenseQuery(
    PurposeQueries.getRiskAnalysisLatest({
      tenantKind: selectedTenantKind,
    })
  )

  const handleClose = () => {
    onClose()
  }

  const handleSubmit = (name: string, answers: Record<string, string[]>) => {
    addEServiceTemplateRiskAnalysis(
      {
        eServiceTemplateId: eserviceTemplateId,
        name: name,
        riskAnalysisForm: {
          version: riskAnalysisLatest.version,
          answers: answers,
        },
        tenantKind: selectedTenantKind,
      },
      { onSuccess: handleClose }
    )
  }

  return (
    <CreateStepPurposeRiskAnalysisForm
      riskAnalysis={riskAnalysisLatest}
      onSubmit={handleSubmit}
      onCancel={handleClose}
    />
  )
}
