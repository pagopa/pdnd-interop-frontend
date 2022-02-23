import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Purpose, StepperStep } from '../../types'
import { PurposeCreateStep1General } from '../components/PurposeCreateStep1General'
import { PurposeCreateStep2RiskAnalysis } from '../components/PurposeCreateStep2RiskAnalysis'
import { PurposeCreateStep3Clients } from '../components/PurposeCreateStep3Clients'
import { Contained } from '../components/Shared/Contained'
import { StyledIntro, StyledIntroChildrenProps } from '../components/Shared/StyledIntro'
import { StyledStepper } from '../components/Shared/StyledStepper'
import { useActiveStep } from '../hooks/useActiveStep'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { useRoute } from '../hooks/useRoute'
import { buildDynamicPath, getBits } from '../lib/router-utils'

const STEPS: Array<StepperStep & { intro: StyledIntroChildrenProps }> = [
  {
    label: 'Generale',
    component: PurposeCreateStep1General,
    intro: { title: 'Informazioni generali' },
  },
  {
    label: 'Analisi del rischio',
    component: PurposeCreateStep2RiskAnalysis,
    intro: {
      title: 'Analisi del rischio',
      description:
        'Le domande del questionario varieranno in base alle risposte fornite man mano. Modificando la risposta a una domanda precedente, le successive domande potrebbero variare',
    },
  },
  {
    label: 'Client',
    component: PurposeCreateStep3Clients,
    intro: { title: 'Associazione client' },
  },
]

export const PurposeCreate = () => {
  const { routes } = useRoute()
  const { activeStep, forward, back } = useActiveStep()
  const { component: Step, intro } = STEPS[activeStep]
  const stepProps = { forward, back }
  const history = useHistory()
  const bits = getBits(history.location)
  const purposeId = bits[bits.length - 1]

  const { data } = useAsyncFetch<Purpose>(
    { path: { endpoint: 'PURPOSE_GET_SINGLE' }, config: { params: { purposeId } } },
    { loadingTextLabel: 'Stiamo caricando le informazioni della finalità' }
  )

  useEffect(() => {
    // If this purpose is not in draft, you cannot edit it
    if (data && data.versions.length === 1 && data.versions[0].state !== 'DRAFT') {
      history.replace(buildDynamicPath(routes.SUBSCRIBE_PURPOSE_VIEW.PATH, { purposeId }))
    }
  }, [data]) // eslint-disable-line react-hooks/exhaustive-deps

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
