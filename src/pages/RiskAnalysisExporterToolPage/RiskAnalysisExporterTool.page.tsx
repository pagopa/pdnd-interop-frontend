import React from 'react'
import { PageContainer } from '@/components/layout/containers'
import { useActiveStep } from '@/hooks/useActiveStep'
import type { StepperStep } from '@/types/common.types'
import { Stepper } from '@/components/shared/Stepper'
import { Alert } from '@mui/material'
import { RiskAnalysisFormStep } from './components/RiskAnalysisToolFormStep'
import { RiskAnalysisToolJsonExportStep } from './components/RiskAnalysisToolJsonExportStep'
import { RiskAnalysisExporterToolContextProvider } from './components/RiskAnalysisExporterToolContext'
import { useTranslation } from 'react-i18next' // Import here

const RiskAnalysisExporterToolPage: React.FC = () => {
  const { t } = useTranslation('developer-tools')

  const { activeStep, ...stepActions } = useActiveStep()

  const steps: Array<StepperStep> = [
    {
      label: t('riskAnalysisExporterTool.page.steps.riskAnalysis'),
      component: RiskAnalysisFormStep,
    },
    {
      label: t('riskAnalysisExporterTool.page.steps.exportGeneration'),
      component: RiskAnalysisToolJsonExportStep,
    },
  ]

  const { component: Step } = steps[activeStep]

  return (
    <PageContainer
      title={t('riskAnalysisExporterTool.page.title')}
      description={t('riskAnalysisExporterTool.page.description')}
      backToAction={{
        to: 'DEVELOPER_TOOLS',
        label: t('backToDeveloperToolsLabel'),
      }}
    >
      <Alert severity="info" sx={{ my: 2 }}>
        {t('riskAnalysisExporterTool.page.alertInfo')}
      </Alert>

      <Stepper steps={steps} activeIndex={activeStep} />

      <RiskAnalysisExporterToolContextProvider {...stepActions}>
        <Step />
      </RiskAnalysisExporterToolContextProvider>
    </PageContainer>
  )
}

export default RiskAnalysisExporterToolPage
