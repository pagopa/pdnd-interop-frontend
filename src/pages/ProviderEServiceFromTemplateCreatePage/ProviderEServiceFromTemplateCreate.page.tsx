import { useActiveStep } from '@/hooks/useActiveStep'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useParams } from '@/router'
import { Link } from '@mui/material'
import { TemplateQueries } from '@/api/template'
import { StepperStep } from '@/types/common.types'
import {
  EServiceCreateStepAttributes,
  EServiceCreateStepAttributesSkeleton,
} from '../ProviderEServiceCreatePage/components/EServiceCreateStepAttributes'
import {
  EServiceCreateStepDocuments,
  EServiceCreateStepDocumentsSkeleton,
} from '../ProviderEServiceCreatePage/components/EServiceCreateStepDocuments'
import {
  EServiceCreateStepGeneral,
  EServiceCreateStepGeneralSkeleton,
} from '../ProviderEServiceCreatePage/components/EServiceCreateStepGeneral'
import {
  EServiceCreateStepPurpose,
  EServiceCreateStepPurposeSkeleton,
} from '../ProviderEServiceCreatePage/components/EServiceCreateStepPurpose/EServiceCreateStepPurpose'
import {
  EServiceCreateStepVersion,
  EServiceCreateStepVersionSkeleton,
} from '../ProviderEServiceCreatePage/components/EServiceCreateStepVersion'
import { PageContainer } from '@/components/layout/containers'
import { Stepper } from '@/components/shared/Stepper'
import { EServiceCreateContextProvider } from '../ProviderEServiceCreatePage/components/EServiceCreateContext'
import { attributesHelpLink } from '@/config/constants'
import { EServiceQueries } from '@/api/eservice'
import { EServiceMode } from '@/api/api.generatedTypes'

const ProviderEServiceFromTemplateCreate: React.FC = () => {
  const { t } = useTranslation('eservice')
  const { t: tTemplate } = useTranslation('template')
  const { eServiceTemplateId, eserviceId, descriptorId } = useParams<
    'PROVIDE_ESERVICE_FROM_TEMPLATE_CREATE' | 'PROVIDE_ESERVICE_TEMPLATE_EDIT'
  >()
  const { activeStep, ...stepProps } = useActiveStep()

  const isNewEService = !eserviceId || !descriptorId

  const { data: template } = useQuery({
    ...TemplateQueries.getSingleByEServiceTemplateId(eServiceTemplateId),
  })

  const { data: descriptor, isLoading: isLoadingDescriptor } = useQuery({
    ...EServiceQueries.getDescriptorProvider(eserviceId as string, descriptorId as string),
    enabled: !isNewEService,
  })

  const steps: Array<StepperStep> =
    template?.mode === 'DELIVER'
      ? [
          { label: t('create.stepper.step1Label'), component: EServiceCreateStepGeneral },
          { label: t('create.stepper.step2Label'), component: EServiceCreateStepVersion },
          { label: t('create.stepper.step3Label'), component: EServiceCreateStepAttributes },
          { label: t('create.stepper.step4Label'), component: EServiceCreateStepDocuments },
        ]
      : [
          { label: t('create.stepper.step1Label'), component: EServiceCreateStepGeneral },
          { label: t('create.stepper.step2ReceiveLabel'), component: EServiceCreateStepPurpose },
          { label: t('create.stepper.step2Label'), component: EServiceCreateStepVersion },
          { label: t('create.stepper.step3Label'), component: EServiceCreateStepAttributes },
          { label: t('create.stepper.step4Label'), component: EServiceCreateStepDocuments },
        ]

  const { component: Step } = steps[activeStep]

  const isReady = Boolean(isNewEService || (!isLoadingDescriptor && descriptor))

  const stepsLoadingSkeletons =
    template?.mode === 'DELIVER'
      ? [
          <EServiceCreateStepGeneralSkeleton key={1} />,
          <EServiceCreateStepVersionSkeleton key={2} />,
          <EServiceCreateStepAttributesSkeleton key={3} />,
          <EServiceCreateStepDocumentsSkeleton key={4} />,
        ]
      : [
          <EServiceCreateStepGeneralSkeleton key={1} />,
          <EServiceCreateStepPurposeSkeleton key={2} />,
          <EServiceCreateStepVersionSkeleton key={3} />,
          <EServiceCreateStepAttributesSkeleton key={4} />,
          <EServiceCreateStepDocumentsSkeleton key={5} />,
        ]

  return (
    <PageContainer
      title={tTemplate('createInstance.title')}
      description={
        <Trans
          components={{ 1: <Link underline="hover" href={attributesHelpLink} target="_blank" /> }}
        >
          {tTemplate('createInstance.templateDescriptionLink', {
            templateName: template?.name,
          })}
        </Trans>
      }
      backToAction={{
        label: t('backToListBtn'),
        to: 'PROVIDE_ESERVICE_TEMPLATES_CATALOG',
      }}
      isLoading={false}
    >
      <Stepper steps={steps} activeIndex={activeStep} />
      {isReady && (
        <EServiceCreateContextProvider
          isEServiceFromTemplate={true}
          descriptor={descriptor}
          eserviceMode={template?.mode as EServiceMode}
          onEserviceModeChange={() => alert('change')}
          {...stepProps}
        >
          <Step />
        </EServiceCreateContextProvider>
      )}
      {!isReady && stepsLoadingSkeletons[activeStep]}
    </PageContainer>
  )
}

export default ProviderEServiceFromTemplateCreate
