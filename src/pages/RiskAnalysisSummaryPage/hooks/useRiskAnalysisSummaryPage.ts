import { PurposeQueries } from '@/api/purpose'
import { useNavigate, useParams } from '@/router'
import { checkIsRulesetExpired } from '@/utils/purpose.utils'
import { useQuery } from '@tanstack/react-query'
import { useGetConsumerPurposeAlertProps } from '../../ConsumerPurposeSummaryPage/hooks/useGetConsumerPurposeAlertProps'
import { useDialog } from '@/stores'

export function useRiskAnalysisSummaryPage() {
  const { purposeId } = useParams<'SUBSCRIBE_RISK_ANALYSIS_SUMMARY'>()
  const navigate = useNavigate()
  const { openDialog } = useDialog()

  const { data: purpose, isLoading } = useQuery(PurposeQueries.getSingle(purposeId))

  const isEserviceDeliverMode = purpose?.eservice.mode === 'DELIVER'

  const expirationDate = purpose?.rulesetExpiration
  const isRulesetExpired = checkIsRulesetExpired(expirationDate)

  const alertProps = useGetConsumerPurposeAlertProps(purpose)

  const eservicePersonalData = purpose?.eservice.personalData

  const riskAnswer = purpose?.riskAnalysisForm?.answers?.usesPersonalData?.[0]

  const isRiskAnswerIncompatible =
    !!riskAnswer &&
    eservicePersonalData !== undefined &&
    ((riskAnswer === 'YES' && eservicePersonalData !== true) ||
      (riskAnswer === 'NO' && eservicePersonalData !== false))

  const isPublishButtonDisabled =
    (purpose?.riskAnalysisForm && isRiskAnswerIncompatible) ||
    (isEserviceDeliverMode && isRulesetExpired)

  const arePublishOrEditButtonsDisabled =
    purpose?.agreement.state === 'ARCHIVED' || purpose?.eservice.descriptor.state === 'ARCHIVED'

  const handleEditDraft = () => {
    navigate('SUBSCRIBE_RISK_ANALYSIS_COMPILE', {
      params: { purposeId },
    })
  }

  const handleApproveDraft = () => {
    if (!purpose?.currentVersion) return
    openDialog({
      type: 'approveRiskAnalysis',
      purposeId,
    })
  }

  const handleRejectDraft = () => {
    if (!purpose?.currentVersion) return
    openDialog({
      type: 'rejectRiskAnalysis',
      purposeId,
    })
  }

  return {
    purposeId,
    purpose,
    isLoading,
    isEserviceDeliverMode,
    expirationDate,
    isRulesetExpired,
    alertProps,
    isPublishButtonDisabled,
    arePublishOrEditButtonsDisabled,
    handleEditDraft,
    handleRejectDraft,
    handleApproveDraft,
  }
}
