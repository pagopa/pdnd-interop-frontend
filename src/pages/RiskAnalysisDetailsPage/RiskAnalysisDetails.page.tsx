import { PurposeQueries } from '@/api/purpose'
import { AuthHooks } from '@/api/auth'
import { PageContainer } from '@/components/layout/containers'
import { useActiveTab } from '@/hooks/useActiveTab'
import { useMarkNotificationsAsRead } from '@/hooks/useMarkNotificationsAsRead'
import { useNavigate, useParams } from '@/router'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Alert, Grid, Tab } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useLocation } from 'react-router-dom'
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
  const { jwt } = AuthHooks.useJwt()
  const { activeTab, updateActiveTab } = useActiveTab(RiskAnalysisDetailsPageTab.DETAILS)
  const locationState: unknown = useLocation().state
  const [isWaitingForConclusion, setIsWaitingForConclusion] = React.useState(
    () =>
      typeof locationState === 'object' &&
      locationState !== null &&
      'awaitRiskAnalysisConclusion' in locationState &&
      locationState.awaitRiskAnalysisConclusion === true
  )

  const {
    data: purpose,
    isLoading,
    isFetching,
  } = useQuery({
    ...PurposeQueries.getSingle(purposeId),
    throwOnError: true,
    refetchInterval: isWaitingForConclusion ? 1000 : false,
  })

  const isAssignedReviewer =
    purpose?.reviewerWorkflow?.reviewers?.some((reviewer) => reviewer.userId === jwt?.uid) ?? false

  useMarkNotificationsAsRead(isAssignedReviewer ? purposeId : undefined)

  const signingState = purpose?.reviewerWorkflow?.signingState
  const concludedSigningState = isConcludedSigningState(signingState) ? signingState : undefined

  // A successful mutation can precede the readmodel update. Match the global polling window,
  // but start it on arrival from the success page, even if the user stayed there for a while.
  React.useEffect(() => {
    if (!isWaitingForConclusion) return
    if (concludedSigningState) {
      setIsWaitingForConclusion(false)
      return
    }

    const timeout = window.setTimeout(() => setIsWaitingForConclusion(false), 20_000)
    return () => window.clearTimeout(timeout)
  }, [isWaitingForConclusion, concludedSigningState])

  React.useEffect(() => {
    if (
      !isWaitingForConclusion &&
      !isFetching &&
      purpose &&
      (!isAssignedReviewer || !concludedSigningState)
    ) {
      navigate('SUBSCRIBE_RISK_ANALYSIS_LIST', { replace: true })
    }
  }, [
    purpose,
    isAssignedReviewer,
    concludedSigningState,
    isFetching,
    isWaitingForConclusion,
    navigate,
  ])

  if (purpose && !isAssignedReviewer) return null

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
