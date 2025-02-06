import React from 'react'
import { PurposeQueries } from '@/api/purpose'
import { EServiceMutations } from '@/api/eservice'
import { useQuery } from '@tanstack/react-query'
import { useCreateContext } from '@/components/shared/CreateContext'
import { TemplateMutations } from '@/api/template'
import {
  CreateStepPurposeRiskAnalysisForm,
  RiskAnalysisFormSkeleton,
} from './CreateStepPurposeRiskAnalysisForm'

export const CreateStepPurposeRiskAnalysis: React.FC = () => {
  const { riskAnalysisFormState, closeRiskAnalysisForm, descriptor, template } = useCreateContext()

  const { mutate: addEServiceRiskAnalysis } = EServiceMutations.useAddEServiceRiskAnalysis()
  const { mutate: updateEServiceRiskAnalysis } = EServiceMutations.useUpdateEServiceRiskAnalysis()

  const { mutate: addTemplateRiskAnalysis } = TemplateMutations.useAddTemplateRiskAnalysis()
  const { mutate: updateTemplateRiskAnalysis } = TemplateMutations.useUpdateTemplateRiskAnalysis()

  const { data: riskAnalysisLatest } = useQuery(
    PurposeQueries.getRiskAnalysisLatest({
      /**
       * We need to retrieve the risk analysis configuration for the tenant kind of the producer
       * because the actual user might be a producer delegate with a different tenant kind.
       */
      tenantKind:
        descriptor?.eservice.producer.tenantKind || template?.eservice.producer.tenantKind,
    })
  )

  if (!riskAnalysisLatest || (!descriptor && !template)) return <RiskAnalysisFormSkeleton /> //TODO

  const riskAnalysisToEdit =
    descriptor?.eservice.riskAnalysis.find(
      (item) => item.id === riskAnalysisFormState.riskAnalysisId
    ) ||
    template?.eservice.riskAnalysis.find((item) => item.id === riskAnalysisFormState.riskAnalysisId)

  const handleCancel = () => {
    closeRiskAnalysisForm()
  }

  const handleSubmit = (name: string, answers: Record<string, string[]>) => {
    if (riskAnalysisFormState.riskAnalysisId && riskAnalysisToEdit) {
      if (descriptor) {
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
      if (template) {
        updateTemplateRiskAnalysis(
          {
            eserviceTemplateId: template?.eservice.id,
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
    }

    if (!riskAnalysisFormState.riskAnalysisId) {
      if (descriptor) {
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
      if (template) {
        addTemplateRiskAnalysis(
          {
            eserviceTemplateId: template?.eservice.id,
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
