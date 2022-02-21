import React from 'react'
import { StepperStep } from '../../types'
import { PurposeWriteStep1General } from '../components/PurposeWriteStep1General'
import { PurposeWriteStep2RiskAnalysis } from '../components/PurposeWriteStep2RiskAnalysis'
import { PurposeWriteStep3Clients } from '../components/PurposeWriteStep3Clients'
import { Contained } from '../components/Shared/Contained'
import { StyledIntro, StyledIntroChildrenProps } from '../components/Shared/StyledIntro'
import { StyledStepper } from '../components/Shared/StyledStepper'
import { useActiveStep } from '../hooks/useActiveStep'

const STEPS: Array<StepperStep & { intro: StyledIntroChildrenProps }> = [
  {
    label: 'Generale',
    component: PurposeWriteStep1General,
    intro: { title: 'Informazioni generali' },
  },
  {
    label: 'Analisi del rischio',
    component: PurposeWriteStep2RiskAnalysis,
    intro: {
      title: 'Analisi del rischio',
      description:
        'Le domande del questionario varieranno in base alle risposte fornite man mano. Modificando la risposta a una domanda precedente, le successive domande potrebbero variare',
    },
  },
  {
    label: 'Client',
    component: PurposeWriteStep3Clients,
    intro: { title: 'Associazione client' },
  },
]

export const PurposeCreate = () => {
  const { activeStep, forward, back } = useActiveStep()
  const { component: Step, intro } = STEPS[activeStep]
  const stepProps = { forward, back }

  return (
    <React.Fragment>
      <StyledIntro>{{ title: 'Crea finalità' }}</StyledIntro>
      <StyledStepper steps={STEPS} activeIndex={activeStep} />
      <Contained>
        <StyledIntro variant="h2" sx={{ mb: 2, pb: 0 }}>
          {intro}
        </StyledIntro>
        <Step {...stepProps} />
      </Contained>
    </React.Fragment>
  )
}
