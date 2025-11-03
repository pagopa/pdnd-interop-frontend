import { PurposeQueries } from '@/api/purpose/purpose.queries'
import { PurposeTemplateQueries } from '@/api/purposeTemplate/purposeTemplate.queries'
import { useParams } from '@/router'
import { useQuery } from '@tanstack/react-query'
import { RiskAnalysisFormTemplate } from '@/pages/ConsumerPurposeTemplateEditPage/components/PurposeTemplateEditStepRiskAnalysis'
import type { RiskAnalysisTemplateAnswer } from '@/api/api.generatedTypes'

const PurposeFromTemplateEditStepRiskAnalysis: React.FC = () => {
  const { purposeTemplateId, purposeId } = useParams<'SUBSCRIBE_PURPOSE_FROM_TEMPLATE_EDIT'>()
  const { data: purposeTemplate } = useQuery(PurposeTemplateQueries.getSingle(purposeTemplateId))
  const { data: purpose } = useQuery(PurposeQueries.getSingle(purposeId))
  const { data: riskAnalysis } = useQuery(
    PurposeQueries.getRiskAnalysisLatest({ tenantKind: purpose?.consumer.kind })
  )
  if (!riskAnalysis || !purpose || !purposeTemplate || !purposeTemplate.purposeRiskAnalysisForm) {
    return
  }

  const mergedDefaultAnswers = {
    ...purpose.riskAnalysisForm?.answers,
    ...purposeTemplate.purposeRiskAnalysisForm?.answers,
  } as Record<string, RiskAnalysisTemplateAnswer>

  return (
    <RiskAnalysisFormTemplate //TODO: move in shared component
      riskAnalysis={riskAnalysis}
      defaultAnswers={mergedDefaultAnswers}
      onSubmit={() => {}}
      onCancel={() => {}}
      type="consumer"
    />
  )
}

export default PurposeFromTemplateEditStepRiskAnalysis
