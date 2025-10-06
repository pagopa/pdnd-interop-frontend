import React from 'react'
import { useTranslation } from 'react-i18next'
import { SectionContainer } from '@/components/layout/containers'
import type { PurposeTemplateWithCompactCreator } from '@/api/api.generatedTypes'
import { PurposeTemplateRiskAnalysisInfoSummary } from './PurposeTemplateRiskAnalysisInfoSummary'

type PurposeTemplateRiskAnalysisTabProps = {
  purposeTemplate: PurposeTemplateWithCompactCreator
}

export const PurposeTemplateRiskAnalysisTab: React.FC<PurposeTemplateRiskAnalysisTabProps> = ({
  purposeTemplate,
}) => {
  const { t } = useTranslation('purposeTemplate', { keyPrefix: 'read.riskAnalysisTab' })

  const title = purposeTemplate.targetTenantKind === 'PA' ? t('titlePA') : t('titleNotPA')

  return (
    <>
      <SectionContainer
        title={title}
        sx={{
          backgroundColor: 'paper.main',
        }}
      >
        <PurposeTemplateRiskAnalysisInfoSummary purposeTemplate={purposeTemplate} />
      </SectionContainer>
    </>
  )
}
