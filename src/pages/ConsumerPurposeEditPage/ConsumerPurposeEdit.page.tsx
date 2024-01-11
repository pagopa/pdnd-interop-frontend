import React from 'react'
import { PageContainer } from '@/components/layout/containers'
import { Stepper } from '@/components/shared/Stepper'
import { useActiveStep } from '@/hooks/useActiveStep'
import { useTranslation } from 'react-i18next'
import type { StepperStep } from '@/types/common.types'
import { PurposeEditStep1General } from './components/PurposeEditStep1General'
import { PurposeEditStep2RiskAnalysis } from './components/PurposeEditStep2RiskAnalysis'
import { PurposeEditStep3Clients } from './components/PurposeEditStep3Clients'
import { useParams } from '@/router'
import { PurposeQueries } from '@/api/purpose'

const ConsumerPurposeEditPage: React.FC = () => {
  const { t } = useTranslation('purpose')
  const { activeStep, forward, back } = useActiveStep()

  const { purposeId } = useParams<'SUBSCRIBE_PURPOSE_EDIT'>()
  const { data: purpose, isLoading: isLoadingPurpose } = PurposeQueries.useGetSingle(purposeId, {
    suspense: false,
  })

  const steps: Array<StepperStep> = purpose?.riskAnalysisForm?.riskAnalysisId
    ? [
        { label: t('edit.stepper.step1Label'), component: PurposeEditStep1General },
        { label: t('edit.stepper.step3Label'), component: PurposeEditStep3Clients },
      ]
    : [
        { label: t('edit.stepper.step1Label'), component: PurposeEditStep1General },
        { label: t('edit.stepper.step2Label'), component: PurposeEditStep2RiskAnalysis },
        { label: t('edit.stepper.step3Label'), component: PurposeEditStep3Clients },
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
      <Stepper steps={steps} activeIndex={activeStep} />
      <Step {...stepProps} />
    </PageContainer>
  )
}

export default ConsumerPurposeEditPage
