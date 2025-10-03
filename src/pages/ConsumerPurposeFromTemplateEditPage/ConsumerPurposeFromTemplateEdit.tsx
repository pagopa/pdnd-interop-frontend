import React from 'react'
import { PageContainer } from '@/components/layout/containers'
import { Stepper } from '@/components/shared/Stepper'
import { useActiveStep } from '@/hooks/useActiveStep'
import { useTranslation } from 'react-i18next'
import type { StepperStep } from '@/types/common.types'
import { useParams } from '@/router'
import { useQuery } from '@tanstack/react-query'

import { PurposeEditStepRiskAnalysis } from '../ConsumerPurposeEditPage/components/PurposeEditStepRiskAnalysis'
import { PurposeTemplateQueries } from '@/api/purposeTemplate/purposeTemplate.queries'
import { PurposeFromTemplateEditStepGeneral } from './components/PurposeFromTemplateEditStepGeneral/PurposeFromTemplateEditStepGeneral'

const ConsumerPurposeFromTemplateEditPage: React.FC = () => {
  const { t } = useTranslation('purpose')
  const { activeStep, forward, back } = useActiveStep()

  const { purposeTemplateId } = useParams<'SUBSCRIBE_PURPOSE_FROM_TEMPLATE_EDIT'>()

  const { isLoading: isLoadingPurposeTemplate } = useQuery(
    PurposeTemplateQueries.getSingle(purposeTemplateId)
  )

  const steps: Array<StepperStep> = [
    { label: t('edit.stepper.stepGeneralLabel'), component: PurposeFromTemplateEditStepGeneral },
    // { label: t('edit.stepper.stepRiskAnalysisLabel'), component: PurposeEditStepRiskAnalysis },
  ]

  const { component: Step } = steps[activeStep]
  const stepProps = { forward, back }

  return (
    <PageContainer
      title={t('edit.emptyTitle')}
      isLoading={isLoadingPurposeTemplate}
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

export default ConsumerPurposeFromTemplateEditPage
