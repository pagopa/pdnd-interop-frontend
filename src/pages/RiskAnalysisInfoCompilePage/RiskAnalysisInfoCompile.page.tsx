import { PurposeQueries } from '@/api/purpose'
import { PageContainer, SectionContainer } from '@/components/layout/containers'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { formatDateStringNumeric } from '@/utils/format.utils'
import { AuthHooks } from '@/api/auth'
import { useNavigate, useParams } from '@/router'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Grid, Stack } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import {
  RiskAnalysisPurposeGeneralInfoSection,
  RiskAnalysisPurposeGeneralInfoSectionSkeleton,
  RiskAnalysisPurposeLoadEstimateSection,
  RiskAnalysisPurposeLoadEstimateSectionSkeleton,
} from '@/components/shared/RiskAnalysisPurposeInfoSections'

const RiskAnalysisInfoCompilePage: React.FC = () => {
  const { t } = useTranslation('purpose', { keyPrefix: 'riskAnalysisInfoCompile' })
  const { t: tCommon } = useTranslation('common')
  const { purposeId } = useParams<'SUBSCRIBE_RISK_ANALYSIS_INFO_COMPILE'>()
  const navigate = useNavigate()
  const { jwt, isReviewer } = AuthHooks.useJwt()

  const { data: purpose, isLoading } = useQuery({
    ...PurposeQueries.getSingle(purposeId),
    throwOnError: true,
  })

  const handleBeginCompile = () => {
    if (purpose?.id) {
      navigate('SUBSCRIBE_RISK_ANALYSIS_COMPILE', {
        params: { purposeId: purpose.id },
      })
    }
  }

  const loggedReviewer = purpose?.reviewerWorkflow?.reviewers?.find((r) => r.userId === jwt?.uid)
  const assignmentDate = loggedReviewer?.sentToReviewerAt
    ? formatDateStringNumeric(loggedReviewer.sentToReviewerAt)
    : '-'

  const reviewers = purpose?.reviewerWorkflow?.reviewers ?? []
  // An assigned reviewer may no longer be resolvable (role revoked on SelfCare, left the
  // organization, or a different tenant in a delegation): fall back to a placeholder
  // instead of rendering a blank value.
  const reviewerNames = reviewers
    .map((reviewer) => `${reviewer.name} ${reviewer.familyName}`.trim())
    .map((name) => name || tCommon('reviewerUnknown'))

  return (
    <PageContainer
      title={t('title')}
      isLoading={isLoading}
      backToAction={{
        label: t('backToListBtn'),
        to: 'SUBSCRIBE_RISK_ANALYSIS_LIST',
      }}
    >
      <Grid container sx={{ mt: 3 }}>
        <Grid item xs={12}>
          {!purpose ? (
            <RiskAnalysisInfoCompilePageSkeleton isReviewer={isReviewer} />
          ) : (
            <Stack spacing={3}>
              <RiskAnalysisPurposeGeneralInfoSection purpose={purpose} />
              <RiskAnalysisPurposeLoadEstimateSection purpose={purpose} />
              {isReviewer && (
                <SectionContainer title={t('reviewersSection.label')}>
                  <Stack component="dl" spacing={3} sx={{ m: 0 }}>
                    <InformationContainer
                      label={t('reviewersSection.assignmentDate.label')}
                      content={assignmentDate}
                    />
                    <InformationContainer
                      label={t('reviewersSection.reviewers.label')}
                      content={reviewerNames.join(', ') || '-'}
                    />
                  </Stack>
                </SectionContainer>
              )}
            </Stack>
          )}
        </Grid>
      </Grid>
      <Stack direction="row" sx={{ mt: 5, justifyContent: 'right' }}>
        <Button onClick={handleBeginCompile} variant="contained" type="button" disabled={isLoading}>
          {t('beginCompileBtn')}
        </Button>
      </Stack>
    </PageContainer>
  )
}

type RiskAnalysisInfoCompilePageSkeletonProps = {
  isReviewer: boolean
}

const RiskAnalysisInfoCompilePageSkeleton: React.FC<RiskAnalysisInfoCompilePageSkeletonProps> = ({
  isReviewer,
}) => {
  return (
    <Stack spacing={3}>
      <RiskAnalysisPurposeGeneralInfoSectionSkeleton />
      <RiskAnalysisPurposeLoadEstimateSectionSkeleton />
      {isReviewer && <RiskAnalysisPurposeLoadEstimateSectionSkeleton />}
    </Stack>
  )
}

export default RiskAnalysisInfoCompilePage
