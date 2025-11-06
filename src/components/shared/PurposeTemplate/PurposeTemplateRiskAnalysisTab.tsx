import React from 'react'
import type { PurposeTemplateWithCompactCreator } from '@/api/api.generatedTypes'
import { PurposeTemplateRiskAnalysisInfoSummary } from './PurposeTemplateRiskAnalysisInfoSummary'
import { PurposeQueries } from '@/api/purpose'
import { useQuery } from '@tanstack/react-query'

type PurposeTemplateRiskAnalysisTabProps = {
  purposeTemplate: PurposeTemplateWithCompactCreator
}

export const PurposeTemplateRiskAnalysisTab: React.FC<PurposeTemplateRiskAnalysisTabProps> = ({
  purposeTemplate,
}) => {
  const { data: riskAnalysisLatest } = useQuery(
    PurposeQueries.getRiskAnalysisLatest({
      tenantKind: purposeTemplate.targetTenantKind,
    })
  )

  if (!purposeTemplate.purposeRiskAnalysisForm || !riskAnalysisLatest) return

  return (
    <PurposeTemplateRiskAnalysisInfoSummary
      purposeTemplate={purposeTemplate}
      riskAnalysisForm={purposeTemplate.purposeRiskAnalysisForm}
      riskAnalysisConfig={riskAnalysisLatest}
    />
  )
}
