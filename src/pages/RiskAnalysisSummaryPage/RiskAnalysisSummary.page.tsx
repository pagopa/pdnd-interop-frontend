import { PageContainer } from '@/components/layout/containers'
import { SummaryAccordion, SummaryAccordionSkeleton } from '@/components/shared/SummaryAccordion'
import { Alert, Button, Stack, Tooltip } from '@mui/material'
import React from 'react'
import {
  ConsumerPurposeSummaryGeneralInformationAccordion,
  ConsumerPurposeSummaryRiskAnalysisAccordion,
} from '../ConsumerPurposeSummaryPage/components'
import { ConsumerPurposeSummaryRiskAnalysisAlertContainer } from '../ConsumerPurposeSummaryPage/components/ConsumerPurposeSummaryRiskAnalysisAlertContainer'
import CreateIcon from '@mui/icons-material/Create'
import SendIcon from '@mui/icons-material/Send'
import { useNavigate, useParams } from '@/router'
import { useQuery } from '@tanstack/react-query'
import { PurposeQueries } from '@/api/purpose'
import { useGetConsumerPurposeAlertProps } from '../ConsumerPurposeSummaryPage/hooks/useGetConsumerPurposeAlertProps'
import { checkIsRulesetExpired } from '@/utils/purpose.utils'
import { useTranslation } from 'react-i18next'
import { useDialog } from '@/stores'

const RiskAnalysisSummaryPage: React.FC = () => {
  const { t } = useTranslation('purpose')
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })

  const { purposeId } = useParams<'SUBSCRIBE_RISK_ANALYSIS_SUMMARY'>()

  const { openDialog } = useDialog()

  const navigate = useNavigate()

  const { data: purpose, isLoading } = useQuery(PurposeQueries.getSingle(purposeId))

  const isEserviceDeliverMode = purpose?.eservice.mode === 'DELIVER'

  const expirationDate = purpose?.rulesetExpiration

  const isRulesetExpired = checkIsRulesetExpired(expirationDate)

  const alertProps = useGetConsumerPurposeAlertProps(purpose)

  const eservicePersonalData = purpose?.eservice.personalData

  const checkIncompatibleAnswerValue = () => {
    const userAnswer = purpose?.riskAnalysisForm?.answers['usesPersonalData']?.[0]
    const isYes = userAnswer === 'YES'
    const isNo = userAnswer === 'NO'

    const incompatible =
      (isYes && eservicePersonalData !== true) || (isNo && eservicePersonalData !== false)

    return incompatible
  }

  const isPublishButtonDisabled =
    (purpose?.riskAnalysisForm &&
      eservicePersonalData !== undefined &&
      checkIncompatibleAnswerValue()) ||
    (isEserviceDeliverMode && isRulesetExpired)

  const arePublishOrEditButtonsDisabled =
    purpose?.agreement.state === 'ARCHIVED' || purpose?.eservice.descriptor.state === 'ARCHIVED'

  const handleEditDraft = () => {
    navigate('SUBSCRIBE_RISK_ANALYSIS_COMPILE', {
      params: {
        purposeId,
      },
    })
  }

  const handleApproveDraft = () => {
    if (!purpose?.currentVersion) return
    openDialog({
      type: 'approveRiskAnalysis',
      purposeId,
    })
  }

  return (
    <PageContainer
      title={t('riskAnalysisSummary.title')}
      isLoading={isLoading}
      backToAction={{
        label: t('backToListBtn'),
        to: 'SUBSCRIBE_PURPOSE_LIST',
      }}
    >
      {alertProps && <Alert sx={{ mb: 3 }} {...alertProps} />}
      <Stack spacing={3} sx={{ mt: !alertProps ? 3 : 0 }}>
        <React.Suspense fallback={<SummaryAccordionSkeleton />}>
          <SummaryAccordion
            headline="1"
            title={t('riskAnalysisSummary.generalInformationSection.title')}
            defaultExpanded={true}
          >
            <ConsumerPurposeSummaryGeneralInformationAccordion purposeId={purposeId} />
          </SummaryAccordion>
        </React.Suspense>
        <React.Suspense fallback={<SummaryAccordionSkeleton />}>
          <SummaryAccordion headline="2" title={t('summary.riskAnalysisSection.title')}>
            <ConsumerPurposeSummaryRiskAnalysisAccordion purposeId={purposeId} />
          </SummaryAccordion>
        </React.Suspense>
      </Stack>
      {isEserviceDeliverMode && (
        <ConsumerPurposeSummaryRiskAnalysisAlertContainer
          expirationDate={expirationDate}
          isRulesetExpired={isRulesetExpired}
        />
      )}
      <Alert severity="info" sx={{ mt: 4 }}>
        {t('riskAnalysisSummary.infoAlert')}
      </Alert>
      <Stack spacing={1} sx={{ mt: 4 }} direction="row" justifyContent="end">
        <Button
          disabled={arePublishOrEditButtonsDisabled}
          startIcon={<CreateIcon />}
          variant="text"
          onClick={handleEditDraft}
        >
          {tCommon('editDraft')}
        </Button>

        <Tooltip
          title={isPublishButtonDisabled ? t('riskAnalysisSummary.publishBtnDisabled') : ''}
          arrow
        >
          <span>
            <Button
              disabled={arePublishOrEditButtonsDisabled || isPublishButtonDisabled}
              startIcon={<SendIcon />}
              variant="contained"
              onClick={handleApproveDraft}
            >
              {t('riskAnalysisSummary.approveBtn')}
            </Button>
          </span>
        </Tooltip>
      </Stack>
    </PageContainer>
  )
}

export default RiskAnalysisSummaryPage
