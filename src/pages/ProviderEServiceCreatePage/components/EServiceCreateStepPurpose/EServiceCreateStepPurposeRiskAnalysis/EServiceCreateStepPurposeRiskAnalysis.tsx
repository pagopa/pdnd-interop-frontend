import React from 'react'
import {
  CreateStepPurposeRiskAnalysisForm,
  RiskAnalysisFormSkeleton,
} from '../../../../../components/shared/CreateStepPurposeRiskAnalysisForm'
import { useEServiceCreateContext } from '../../EServiceCreateContext'
import { PurposeQueries } from '@/api/purpose'
import { EServiceMutations } from '@/api/eservice'
import { useQuery } from '@tanstack/react-query'

export const EServiceCreateStepPurposeRiskAnalysis: React.FC = () => {
  const { riskAnalysisFormState, closeRiskAnalysisForm, descriptor } = useEServiceCreateContext()

  const personalData = descriptor?.eservice.personalData

  const { mutate: addEServiceRiskAnalysis } = EServiceMutations.useAddEServiceRiskAnalysis()
  const { mutate: updateEServiceRiskAnalysis } = EServiceMutations.useUpdateEServiceRiskAnalysis()

  const riskAnalysisToEdit = descriptor?.eservice.riskAnalysis.find(
    (item) => item.id === riskAnalysisFormState.riskAnalysisId
  )

  const { data: riskAnalysis } = useQuery({
    ...PurposeQueries.getRiskAnalyisLatestOrSpecificVersion({
      eserviceId: descriptor?.eservice.id,
      riskAnalysisVersion: riskAnalysisToEdit?.riskAnalysisForm.version,
      tenantKind: descriptor?.eservice.producer.tenantKind,
    }),
  })

  if (!riskAnalysis || !descriptor) return <RiskAnalysisFormSkeleton />

  const handleCancel = () => {
    closeRiskAnalysisForm()
  }

  const handleSubmit = (name: string, answers: Record<string, string[]>) => {
    if (riskAnalysisFormState.riskAnalysisId && riskAnalysisToEdit) {
      updateEServiceRiskAnalysis(
        {
          eserviceId: descriptor?.eservice.id,
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
          eserviceId: descriptor?.eservice.id,
          name: name,
          riskAnalysisForm: {
            version: riskAnalysis.version,
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
      riskAnalysis={riskAnalysis}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      personalData={personalData}
    />
  )
}
