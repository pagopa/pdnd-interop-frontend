import React from 'react'
import { PurposeMutations, PurposeQueries } from '@/api/purpose'
import { PageContainer } from '@/components/layout/containers'
import { useNavigate, useParams } from '@/router'
import { useTranslation } from 'react-i18next'
import { Grid } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import {
  RiskAnalysisForm,
  RiskAnalysisFormSkeleton,
} from '../ConsumerPurposeEditPage/components/PurposeEditStepRiskAnalysis/RiskAnalysisForm'
import { RequiredTextLabel } from '@/components/shared/RequiredTextLabel'

const RiskAnalysisCompilePage: React.FC = () => {
  const { t } = useTranslation('purpose', { keyPrefix: 'riskAnalysisCompile' })
  const { purposeId } = useParams<'SUBSCRIBE_RISK_ANALYSIS_COMPILE'>()
  const navigate = useNavigate()

  const { mutate: updateRiskAnalysis } = PurposeMutations.useUpdateRiskAnalysis()
  const { data: purpose, isLoading } = useQuery({
    ...PurposeQueries.getSingle(purposeId),
    throwOnError: true,
  })

  const { data: riskAnalysis } = useQuery({
    ...PurposeQueries.getRiskAnalyisLatestOrSpecificVersion({
      eserviceId: purpose?.eservice.id,
      riskAnalysisVersion: purpose?.riskAnalysisForm?.version,
      tenantKind: purpose?.consumer.kind,
    }),
    enabled: Boolean(purpose),
  })

  if (!purpose || !riskAnalysis) {
    return <RiskAnalysisFormSkeleton />
  }

  const goToSummary = () => {
    navigate('SUBSCRIBE_RISK_ANALYSIS_SUMMARY', {
      params: {
        purposeId: purposeId,
      },
    })
  }

  const handleSubmit = (answers: Record<string, string[]>) => {
    updateRiskAnalysis(
      {
        purposeId: purpose.id,
        title: purpose.title,
        description: purpose.description,
        riskAnalysisForm: { version: riskAnalysis.version, answers },
        freeOfChargeReason: purpose.freeOfChargeReason,
        isFreeOfCharge: purpose.isFreeOfCharge,
        dailyCalls:
          purpose.currentVersion?.dailyCalls ?? purpose.waitingForApprovalVersion?.dailyCalls ?? 1,
      },
      { onSuccess: goToSummary }
    )
  }

  const back = () => {
    navigate('SUBSCRIBE_RISK_ANALYSIS_INFO_COMPILE', {
      params: {
        purposeId: purposeId,
      },
    })
  }

  return (
    <PageContainer
      title={t('title')}
      isLoading={isLoading}
      backToAction={{
        label: t('backToListBtn'),
        to: 'SUBSCRIBE_RISK_ANALYSIS_LIST',
      }}
    >
      <RequiredTextLabel />
      <Grid container sx={{ mt: 3 }}>
        <RiskAnalysisForm
          riskAnalysis={riskAnalysis}
          defaultAnswers={purpose.riskAnalysisForm?.answers}
          onSubmit={handleSubmit}
          onCancel={back}
          personalData={purpose.eservice.personalData}
          submitLabel={t('forwardWithSaveBtn')}
        />
      </Grid>
    </PageContainer>
  )
}

export default RiskAnalysisCompilePage
