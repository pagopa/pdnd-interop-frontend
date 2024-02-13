import React from 'react'
import { PageContainer } from '@/components/layout/containers'
import { Stepper } from '@/components/shared/Stepper'
import { useActiveStep } from '@/hooks/useActiveStep'
import { useTranslation } from 'react-i18next'
import type { StepperStep } from '@/types/common.types'
import { PurposeEditStepGeneral } from './components/PurposeEditStepGeneral'
import { PurposeEditStepRiskAnalysis } from './components/PurposeEditStepRiskAnalysis'
import { useParams } from '@/router'
import { PurposeQueries } from '@/api/purpose'

const ConsumerPurposeEditPage: React.FC = () => {
  const { t } = useTranslation('purpose')
  const { activeStep, forward, back } = useActiveStep()

  const { purposeId } = useParams<'SUBSCRIBE_PURPOSE_EDIT'>()
  const { data: purpose, isLoading: isLoadingPurpose } = PurposeQueries.useGetSingle(purposeId, {
    suspense: false,
  })

  // TODO refactor rimozione step + number dai nomi e sostituirlo con il nome dello step
  const steps: Array<StepperStep> = purpose?.riskAnalysisForm?.riskAnalysisId
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
      {!purpose?.riskAnalysisForm?.riskAnalysisId && (
        <Stepper steps={steps} activeIndex={activeStep} />
      )}
      <Step {...stepProps} />
    </PageContainer>
  )
}

export default ConsumerPurposeEditPage
