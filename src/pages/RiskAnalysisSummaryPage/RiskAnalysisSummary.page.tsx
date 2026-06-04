import { PageContainer } from '@/components/layout/containers'
import { SummaryAccordion, SummaryAccordionSkeleton } from '@/components/shared/SummaryAccordion'
import { Alert, Button, Stack, Tooltip } from '@mui/material'
import React from 'react'
import CreateIcon from '@mui/icons-material/Create'
import SendIcon from '@mui/icons-material/Send'
import { useTranslation } from 'react-i18next'

import {
  ConsumerPurposeSummaryGeneralInformationAccordion,
  ConsumerPurposeSummaryRiskAnalysisAccordion,
} from '../ConsumerPurposeSummaryPage/components'

import { ConsumerPurposeSummaryRiskAnalysisAlertContainer } from '../ConsumerPurposeSummaryPage/components/ConsumerPurposeSummaryRiskAnalysisAlertContainer'

import { useRiskAnalysisSummaryPage } from './hooks/useRiskAnalysisSummaryPage'

const RiskAnalysisSummaryPage: React.FC = () => {
  const { t } = useTranslation('purpose')
  const { t: tCommon } = useTranslation('common', {
    keyPrefix: 'actions',
  })

  const {
    purposeId,
    isLoading,
    alertProps,
    isPublishButtonDisabled,
    arePublishOrEditButtonsDisabled,
    handleEditDraft,
    handleApproveDraft,
    isEserviceDeliverMode,
    expirationDate,
    isRulesetExpired,
  } = useRiskAnalysisSummaryPage()

  return (
    <PageContainer
      title={t('riskAnalysisSummary.title')}
      isLoading={isLoading}
      backToAction={{
        label: t('riskAnalysisSummary.backToListBtn'),
        to: 'SUBSCRIBE_RISK_ANALYSIS_LIST',
      }}
    >
      {alertProps && <Alert sx={{ mb: 3 }} {...alertProps} />}

      <Stack spacing={3} sx={{ mt: !alertProps ? 3 : 0 }}>
        <React.Suspense fallback={<SummaryAccordionSkeleton />}>
          <SummaryAccordion
            headline="1"
            title={t('riskAnalysisSummary.generalInformationSection.title')}
            defaultExpanded
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
