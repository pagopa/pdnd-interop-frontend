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

  const personalDataFlag = descriptor?.eservice.personalData

  const { mutate: addEServiceRiskAnalysis } = EServiceMutations.useAddEServiceRiskAnalysis()
  const { mutate: updateEServiceRiskAnalysis } = EServiceMutations.useUpdateEServiceRiskAnalysis()

  const { data: riskAnalysisLatest } = useQuery(
    PurposeQueries.getRiskAnalysisLatest({
      /**
       * We need to retrieve the risk analysis configuration for the tenant kind of the producer
       * because the actual user might be a producer delegate with a different tenant kind.
       */
      tenantKind: descriptor?.eservice.producer.tenantKind,
    })
  )

  if (!riskAnalysisLatest || !descriptor) return <RiskAnalysisFormSkeleton />

  const riskAnalysisToEdit = descriptor?.eservice.riskAnalysis.find(
    (item) => item.id === riskAnalysisFormState.riskAnalysisId
  )

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
      personalDataFlag={personalDataFlag}
    />
  )
}
