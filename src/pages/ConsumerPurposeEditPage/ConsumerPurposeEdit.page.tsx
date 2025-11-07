import React, { useEffect } from 'react'
import { PageContainer } from '@/components/layout/containers'
import { Stepper } from '@/components/shared/Stepper'
import { useActiveStep } from '@/hooks/useActiveStep'
import { useTranslation } from 'react-i18next'
import type { StepperStep } from '@/types/common.types'
import { PurposeEditStepGeneral } from './components/PurposeEditStepGeneral'
import { PurposeEditStepRiskAnalysis } from './components/PurposeEditStepRiskAnalysis'
import { useParams, useNavigate } from '@/router'
import { PurposeQueries } from '@/api/purpose'
import { useQuery } from '@tanstack/react-query'

const ConsumerPurposeEditPage: React.FC = () => {
  const { t } = useTranslation('purpose')
  const { activeStep, forward, back } = useActiveStep()
  const navigate = useNavigate()

  const { purposeId } = useParams<'SUBSCRIBE_PURPOSE_EDIT'>()

  const { data: purpose, isLoading: isLoadingPurpose } = useQuery(
    PurposeQueries.getSingle(purposeId)
  )

  useEffect(() => {
    if (!isLoadingPurpose && purpose?.purposeTemplate?.id) {
      navigate('SUBSCRIBE_PURPOSE_FROM_TEMPLATE_EDIT', {
        params: {
          purposeId,
          purposeTemplateId: purpose.purposeTemplate.id,
        },
        replace: true,
      })
    }
  }, [purpose, isLoadingPurpose, purposeId, navigate])

  const isReceive = purpose?.eservice.mode === 'RECEIVE'

  const steps: Array<StepperStep> = isReceive
    ? [{ label: t('edit.stepper.stepGeneralLabel'), component: PurposeEditStepGeneral }]
    : [
        { label: t('edit.stepper.stepGeneralLabel'), component: PurposeEditStepGeneral },
        { label: t('edit.stepper.stepRiskAnalysisLabel'), component: PurposeEditStepRiskAnalysis },
      ]

  const { component: Step } = steps[activeStep]
  const stepProps = { forward, back }

  return (
    <PageContainer
      title={t('edit.emptyTitle')}
      isLoading={isLoadingPurpose}
      backToAction={{
        label: t('backToListBtn'),
        to: 'SUBSCRIBE_PURPOSE_LIST',
      }}
    >
      {!isReceive && <Stepper steps={steps} activeIndex={activeStep} />}
      <Step {...stepProps} />
    </PageContainer>
  )
}

export default ConsumerPurposeEditPage
