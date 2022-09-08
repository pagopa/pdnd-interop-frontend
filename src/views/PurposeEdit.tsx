import React from 'react'
import { Grid, Alert } from '@mui/material'
import { EServiceFlatReadType, StepperStep } from '../../types'
import { PurposeCreateStep1General } from '../components/PurposeCreateStep1General'
import { PurposeCreateStep2RiskAnalysis } from '../components/PurposeCreateStep2RiskAnalysis'
import { PurposeCreateStep3Clients } from '../components/PurposeCreateStep3Clients'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { StyledStepper } from '../components/Shared/StyledStepper'
import { useActiveStep } from '../hooks/useActiveStep'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { useRoute } from '../hooks/useRoute'
import { StyledLink } from '../components/Shared/StyledLink'
import { useTranslation } from 'react-i18next'
import { useJwt } from '../hooks/useJwt'
import { LoadingWithMessage } from '../components/Shared/LoadingWithMessage'

export const PurposeEdit = () => {
  const { t } = useTranslation('purpose')
  const { activeStep, forward, back } = useActiveStep()

  const STEPS: Array<StepperStep> = [
    { label: t('create.stepper.step1Label'), component: PurposeCreateStep1General },
    { label: t('create.stepper.step2Label'), component: PurposeCreateStep2RiskAnalysis },
    { label: t('create.stepper.step3Label'), component: PurposeCreateStep3Clients },
  ]
  const { component: Step } = STEPS[activeStep]
  const stepProps = { forward, back }
  const { jwt } = useJwt()
  const { routes } = useRoute()

  const { data: eserviceData, isLoading } = useAsyncFetch<Array<EServiceFlatReadType>>({
    path: { endpoint: 'ESERVICE_GET_LIST_FLAT' },
    config: {
      params: {
        callerId: jwt?.organization.id,
        consumerId: jwt?.organization.id,
        agreementStates: 'ACTIVE',
      },
    },
  })

  if (isLoading) {
    return <LoadingWithMessage label={t('loadingSingleLabel')} transparentBackground />
  }

  return (
    <React.Fragment>
      <StyledIntro>{{ title: t('create.emptyTitle') }}</StyledIntro>
      {eserviceData && Boolean(eserviceData.length > 0) ? (
        <Grid container sx={{ maxWidth: 1280 }}>
          <Grid item lg={8} sx={{ width: '100%' }}>
            <StyledStepper steps={STEPS} activeIndex={activeStep} />
            <Step {...stepProps} />
          </Grid>
        </Grid>
      ) : (
        <Alert severity="info">
          {t('create.noAgreementsAlert.message')}{' '}
          <StyledLink to={routes.SUBSCRIBE_CATALOG_LIST.PATH}>
            {t('create.noAgreementsAlert.link.label')}
          </StyledLink>
        </Alert>
      )}
    </React.Fragment>
  )
}
