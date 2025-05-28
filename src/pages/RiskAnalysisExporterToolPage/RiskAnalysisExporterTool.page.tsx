import React from 'react'
import { PageContainer } from '@/components/layout/containers'
import { useActiveStep } from '@/hooks/useActiveStep'
import type { StepperStep } from '@/types/common.types'
import { Stepper } from '@/components/shared/Stepper'
import { Alert } from '@mui/material'
import { RiskAnalysisFormStep } from './components/RiskAnalysisToolFormStep'
import { RiskAnalysisToolJsonExportStep } from './components/RiskAnalysisToolJsonExportStep'
import { RiskAnalysisExporterToolContextProvider } from './components/RiskAnalysisExporterToolContext'

const RiskAnalysisExporterToolPage: React.FC = () => {
  const { activeStep, ...stepActions } = useActiveStep()

  const steps: Array<StepperStep> = [
    {
      label: 'Analisi del rischio',
      component: RiskAnalysisFormStep,
    },
    {
      label: 'Generazione export',
      component: RiskAnalysisToolJsonExportStep,
    },
  ]

  const { component: Step } = steps[activeStep]

  return (
    <PageContainer
      title={'Export analisi del rischio'}
      description={
        'Lo strumento di export ti permette di esportare in formato .json formattato l’analisi del rischio che compili, pronta per essere utilizzata nelle chiamate di creazione di una finalità nei flussi machine to machine.'
      }
    >
      <Alert severity="info" sx={{ my: 2 }}>
        {'La funzionalità di import dell’analisi del rischio sarà disponibile a breve.'}
      </Alert>

      <Stepper steps={steps} activeIndex={activeStep} />

      <RiskAnalysisExporterToolContextProvider {...stepActions}>
        <Step />
      </RiskAnalysisExporterToolContextProvider>
    </PageContainer>
  )
}

export default RiskAnalysisExporterToolPage
