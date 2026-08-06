import { PurposeQueries } from '@/api/purpose'
import { PageContainer } from '@/components/layout/containers'
import { useActiveTab } from '@/hooks/useActiveTab'
import { useMarkNotificationsAsRead } from '@/hooks/useMarkNotificationsAsRead'
import { useNavigate, useParams } from '@/router'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Alert, Grid, Tab } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  RiskAnalysisDetailsPurposeTab,
  RiskAnalysisDetailsPurposeTabSkeleton,
} from './components/RiskAnalysisDetailsPurposeTab'
import { RiskAnalysisDetailsRejectedAlert } from './components/RiskAnalysisDetailsRejectedAlert'
import { RiskAnalysisDetailsRiskAnalysisTab } from './components/RiskAnalysisDetailsRiskAnalysisTab'
import type { ConcludedSigningState } from './types'

export const RiskAnalysisDetailsPageTab = {
  DETAILS: 'details',
  RISK_ANALYSIS: 'riskAnalysis',
}

const isConcludedSigningState = (
  signingState: string | undefined
): signingState is ConcludedSigningState => signingState === 'SIGNED' || signingState === 'REJECTED'

const RiskAnalysisDetailsPage: React.FC = () => {
  const { t } = useTranslation('purpose', { keyPrefix: 'riskAnalysisDetails' })
  const { purposeId } = useParams<'SUBSCRIBE_RISK_ANALYSIS_DETAILS'>()
  const navigate = useNavigate()
  const { activeTab, updateActiveTab } = useActiveTab(RiskAnalysisDetailsPageTab.DETAILS)

  const {
    data: purpose,
    isLoading,
    isFetching,
  } = useQuery({
    ...PurposeQueries.getSingle(purposeId),
    throwOnError: true,
  })

  useMarkNotificationsAsRead(purposeId)

  const signingState = purpose?.reviewerWorkflow?.signingState
  const concludedSigningState = isConcludedSigningState(signingState) ? signingState : undefined

  // Waits for the query to settle: right after the approval/rejection flow the cache still holds
  // the pre-mutation state, and redirecting on it would bounce the reviewer back to the list.
  React.useEffect(() => {
    if (!isFetching && purpose && !concludedSigningState) {
      navigate('SUBSCRIBE_RISK_ANALYSIS_LIST', { replace: true })
    }
  }, [purpose, concludedSigningState, isFetching, navigate])

  return (
    <PageContainer
      title={purpose?.title}
      isLoading={isLoading}
      statusChip={
        concludedSigningState
          ? { for: 'riskAnalysisList', state: concludedSigningState }
          : undefined
      }
      backToAction={{
        label: t('backToListBtn'),
        to: 'SUBSCRIBE_RISK_ANALYSIS_LIST',
      }}
    >
      {purpose && concludedSigningState ? (
        <>
          {concludedSigningState === 'SIGNED' ? (
            <Alert severity="info" sx={{ mb: 3 }}>
              {t('signedAlert')}
            </Alert>
          ) : (
            <RiskAnalysisDetailsRejectedAlert
              rejectionReason={purpose.reviewerWorkflow?.rejectionReason ?? ''}
            />
          )}

          <TabContext value={activeTab}>
            <TabList
              onChange={updateActiveTab}
              aria-label={t('tabs.ariaLabel')}
              variant="fullWidth"
            >
              <Tab label={t('tabs.details')} value={RiskAnalysisDetailsPageTab.DETAILS} />
              <Tab
                label={t('tabs.riskAnalysis')}
                value={RiskAnalysisDetailsPageTab.RISK_ANALYSIS}
              />
            </TabList>

            <TabPanel value={RiskAnalysisDetailsPageTab.DETAILS}>
              <Grid container>
                <Grid item xs={8}>
                  <RiskAnalysisDetailsPurposeTab
                    purpose={purpose}
                    signingState={concludedSigningState}
                  />
                </Grid>
              </Grid>
            </TabPanel>

            <TabPanel value={RiskAnalysisDetailsPageTab.RISK_ANALYSIS}>
              <Grid container>
                <Grid item xs={8}>
                  <RiskAnalysisDetailsRiskAnalysisTab
                    purpose={purpose}
                    signingState={concludedSigningState}
                  />
                </Grid>
              </Grid>
            </TabPanel>
          </TabContext>
        </>
      ) : (
        <Grid container sx={{ mt: 3 }}>
          <Grid item xs={8}>
            <RiskAnalysisDetailsPurposeTabSkeleton />
          </Grid>
        </Grid>
      )}
    </PageContainer>
  )
}

export default RiskAnalysisDetailsPage
