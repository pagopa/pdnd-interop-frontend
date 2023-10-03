import React from 'react'
import {
  EServiceCreateStepPurposeRiskAnalysisForm,
  RiskAnalysisFormSkeleton,
} from './EServiceCreateStepPurposeRiskAnalysisForm'
import { useEServiceCreateContext } from '../../EServiceCreateContext'
import { PurposeQueries } from '@/api/purpose'

// TODO like the PurposeEditStep2RiskAnalysis

export const EServiceCreateStepPurposeRiskAnalysis: React.FC = () => {
  const { closeRiskAnalysisForm } = useEServiceCreateContext()

  const { data: riskAnalysis } = PurposeQueries.useGetRiskAnalysisLatest({
    suspense: false,
  })

  if (!riskAnalysis) return <RiskAnalysisFormSkeleton />

  const handleCancel = () => {
    console.log('TODO function integration')
    closeRiskAnalysisForm()
  }

  const handleSubmit = (name: string, answers: Record<string, string[]>) => {
    console.log('TODO implement function')
    // then onSuccess
    closeRiskAnalysisForm()
  }

  return (
    <EServiceCreateStepPurposeRiskAnalysisForm
      defaultAnswers={{}}
      riskAnalysis={riskAnalysis}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  )
}
