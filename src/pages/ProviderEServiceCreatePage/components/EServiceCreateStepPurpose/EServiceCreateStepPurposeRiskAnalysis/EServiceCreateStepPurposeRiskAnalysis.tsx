import React from 'react'
import {
  EServiceCreateStepPurposeRiskAnalysisForm,
  RiskAnalysisFormSkeleton,
} from './EServiceCreateStepPurposeRiskAnalysisForm'
import { useEServiceCreateContext } from '../../EServiceCreateContext'
import { PurposeQueries } from '@/api/purpose'
import { EServiceMutations } from '@/api/eservice'

export const EServiceCreateStepPurposeRiskAnalysis: React.FC = () => {
  const { riskAnalysisFormState, closeRiskAnalysisForm, eservice } = useEServiceCreateContext()

  const { mutate: addEServiceRiskAnalysis } = EServiceMutations.useAddEServiceRiskAnalysis()
  const { mutate: updateEServiceRiskAnalysis } = EServiceMutations.useUpdateEServiceRiskAnalysis()

  const { data: riskAnalysisLatest } = PurposeQueries.useGetRiskAnalysisLatest({
    suspense: false,
  })

  if (!riskAnalysisLatest || !eservice) return <RiskAnalysisFormSkeleton />

  const riskAnalysisToEdit = eservice.riskAnalysis.find(
    (item) => item.id === riskAnalysisFormState.riskAnalysisId
  )

  const handleCancel = () => {
    closeRiskAnalysisForm()
  }

  const handleSubmit = (name: string, answers: Record<string, string[]>) => {
    if (riskAnalysisFormState.riskAnalysisId && riskAnalysisToEdit) {
      updateEServiceRiskAnalysis(
        {
          eserviceId: eservice.id,
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
      addEServiceRiskAnalysis(
        {
          eserviceId: eservice.id,
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
    <EServiceCreateStepPurposeRiskAnalysisForm
      defaultName={riskAnalysisToEdit?.name}
      defaultAnswers={riskAnalysisToEdit?.riskAnalysisForm.answers}
      riskAnalysis={riskAnalysisLatest}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  )
}
