import { PageContainer } from '@/components/layout/containers'
import React from 'react'
import { Stepper } from '@/components/shared/Stepper'
import { useActiveStep } from '@/hooks/useActiveStep'
import { useTranslation } from 'react-i18next'
import type { StepperStep } from '@/types/common.types'
import { PurposeTemplateEditStepGeneral } from './components/PurposeTemplateEditStepGeneral/PurposeTemplateEditStepGeneral'
import { PurposeTemplateEditLinkedEService } from './components/PurposeTemplateEditStepLinkedEServices/PurposeTemplateEditLinkedEService'
import { PurposeTemplateEditStepRiskAnalysis } from './components/PurposeTemplateEditStepRiskAnalysis/PurposeTemplateEditRiskAnalysisForm'

const ConsumerPurposeTemplateEditPage: React.FC = () => {
  const { t } = useTranslation('purposeTemplate')
  const { activeStep, forward, back } = useActiveStep()

  const steps: Array<StepperStep> = [
    { label: t('edit.stepper.step1Label'), component: PurposeTemplateEditStepGeneral },
    { label: t('edit.stepper.step2Label'), component: PurposeTemplateEditLinkedEService },
    { label: t('edit.stepper.step3Label'), component: PurposeTemplateEditStepRiskAnalysis },
  ]

  const { component: Step } = steps[activeStep]
  const stepProps = { forward, back }
  return (
    <>
      <PageContainer
        title={t('edit.emptyTitle')}
        backToAction={{
          label: t('backToListBtn'),
          to: 'SUBSCRIBE_PURPOSE_TEMPLATE_LIST',
        }}
      >
        <Stepper steps={steps} activeIndex={activeStep} />
        <Step {...stepProps} />
      </PageContainer>
    </>
  )
}

export default ConsumerPurposeTemplateEditPage
