import React from 'react'
import { Grid, Alert } from '@mui/material'
import { EServiceFlatReadType, StepperStep } from '../../types'
import { PurposeEditStep1General } from '../components/PurposeEditStep1General'
import { PurposeEditStep2RiskAnalysis } from '../components/PurposeEditStep2RiskAnalysis'
import { PurposeEditStep3Clients } from '../components/PurposeEditStep3Clients'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { StyledStepper } from '../components/Shared/StyledStepper'
import { useActiveStep } from '../hooks/useActiveStep'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { useRoute } from '../hooks/useRoute'
import { StyledLink } from '../components/Shared/StyledLink'
import { useTranslation } from 'react-i18next'
import { useJwt } from '../hooks/useJwt'
import { LoadingWithMessage } from '../components/Shared/LoadingWithMessage'
import { MAX_WIDTH } from '../lib/constants'

export const PurposeEdit = () => {
  const { t } = useTranslation('purpose')
  const { activeStep, forward, back } = useActiveStep()

  const STEPS: Array<StepperStep> = [
    { label: t('edit.stepper.step1Label'), component: PurposeEditStep1General },
    { label: t('edit.stepper.step2Label'), component: PurposeEditStep2RiskAnalysis },
    { label: t('edit.stepper.step3Label'), component: PurposeEditStep3Clients },
  ]
  const { component: Step } = STEPS[activeStep]
  const stepProps = { forward, back }
  const { jwt } = useJwt()
  const { routes } = useRoute()

  const { data: eserviceData, isLoading } = useAsyncFetch<Array<EServiceFlatReadType>>({
    path: { endpoint: 'ESERVICE_GET_LIST_FLAT' },
    config: {
      params: {
        callerId: jwt?.organizationId,
        consumerId: jwt?.organizationId,
        agreementStates: 'ACTIVE',
      },
    },
  })

  if (isLoading) {
    return <LoadingWithMessage label={t('loadingSingleLabel')} transparentBackground />
  }

  return (
    <React.Fragment>
      <StyledIntro>{{ title: t('edit.emptyTitle') }}</StyledIntro>
      {eserviceData && Boolean(eserviceData.length > 0) ? (
        <Grid container sx={{ maxWidth: MAX_WIDTH }}>
          <Grid item lg={8} sx={{ width: '100%' }}>
            <StyledStepper steps={STEPS} activeIndex={activeStep} />
            <Step {...stepProps} />
          </Grid>
        </Grid>
      ) : (
        <Alert severity="info">
          {t('edit.noAgreementsAlert.message')}{' '}
          <StyledLink to={routes.SUBSCRIBE_CATALOG_LIST.PATH}>
            {t('edit.noAgreementsAlert.link.label')}
          </StyledLink>
        </Alert>
      )}
    </React.Fragment>
  )
}
