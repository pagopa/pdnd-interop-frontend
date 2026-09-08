import type { Purpose } from '@/api/api.generatedTypes'
import { SectionContainer } from '@/components/layout/containers'
import { PurposeRiskAnalysisInfoSummary } from '@/components/shared/RiskAnalysisInfoSummary'
import { Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import type { ConcludedSigningState } from '../types'

type RiskAnalysisDetailsRiskAnalysisTabProps = {
  purpose: Purpose
  signingState: ConcludedSigningState
}

export const RiskAnalysisDetailsRiskAnalysisTab: React.FC<
  RiskAnalysisDetailsRiskAnalysisTabProps
> = ({ purpose, signingState }) => {
  const { t } = useTranslation('purpose', { keyPrefix: 'riskAnalysisDetails' })
  const { t: tEdit } = useTranslation('purpose', { keyPrefix: 'edit.stepRiskAnalysis' })

  return (
    <Stack spacing={3}>
      <SectionContainer
        title={t('riskAnalysisSection.title')}
        description={
          signingState === 'SIGNED' ? t('riskAnalysisSection.signedSubtitle') : undefined
        }
      >
        <InformationContainer
          label={tEdit('personalDataFlag.label')}
          content={tEdit(`personalDataFlag.content.${purpose.eservice.personalData}`)}
        />
      </SectionContainer>
      {purpose.riskAnalysisForm && (
        <PurposeRiskAnalysisInfoSummary purpose={purpose} innerSection={false} hideTitle />
      )}
    </Stack>
  )
}
