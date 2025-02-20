import React from 'react'
import { PageContainer } from '@/components/layout/containers'
import type { StepperStep } from '@/types/common.types'
import type { EServiceMode } from '@/api/api.generatedTypes'
import { useQuery } from '@tanstack/react-query'
import { useActiveStep } from '@/hooks/useActiveStep'
import { TemplateQueries } from '@/api/template'
import { Redirect, useParams } from '@/router'
import { Stepper } from '@/components/shared/Stepper'
import { EServiceTemplateCreateContextProvider } from './components/ProviderEServiceTemplateContext'
import {
  EServiceTemplateCreateStepGeneral,
  EServiceTemplateCreateStepGeneralSkeleton,
} from './components/EServiceTemplateCreateStepGeneral/EServiceTemplateCreateStepGeneral'
import { useTranslation } from 'react-i18next'
import {
  EServiceTemplateCreateStepVersion,
  EServiceTemplateCreateStepVersionSkeleton,
} from './components/EServiceTemplateCreateStepVersion'
import {
  EServiceTemplateCreateStepAttributes,
  EServiceTemplateCreateStepAttributesSkeleton,
} from './components/EServiceTemplateCreateStepAttributes'
import {
  EServiceTemplateCreateStepPurpose,
  EServiceTemplateCreateStepPurposeSkeleton,
} from './components/EServiceTemplateCreateStepPurpose/EServiceTemplateCreateStepPurpose'
import {
  EServiceTemplateCreateStepDocuments,
  EServiceTemplateCreateStepDocumentsSkeleton,
} from './components/EServiceTemplateCreateStepDocuments/EServiceTemplateCreateStepDocuments'

const ProviderEServiceCreatePage: React.FC = () => {
  const { t } = useTranslation('template')
  const params = useParams<'PROVIDE_ESERVICE_TEMPLATE_CREATE' | 'PROVIDE_ESERVICE_TEMPLATE_EDIT'>()
  const { activeStep, ...stepProps } = useActiveStep()

  const isNewEServiceTemplate = !params?.templateId

  const [selectedEServiceTemplateMode, setSelectedEServiceTemplateMode] = React.useState<
    EServiceMode | undefined
  >()

  const { data: template, isLoading: isLoadingTemplate } = useQuery({
    ...TemplateQueries.getSingle(params?.templateId as string, params?.versionId as string),
    enabled: !isNewEServiceTemplate,
  })

  const eserviceTemplateMode =
    selectedEServiceTemplateMode || // The mode selected by the user
    template?.eserviceTemplate.mode || // The mode of the e-service
    'DELIVER' // Default mode

  const steps: Array<StepperStep> =
    eserviceTemplateMode === 'DELIVER'
      ? [
          { label: t('create.stepper.step1Label'), component: EServiceTemplateCreateStepGeneral },
          { label: t('create.stepper.step2Label'), component: EServiceTemplateCreateStepVersion },
          {
            label: t('create.stepper.step3Label'),
            component: EServiceTemplateCreateStepAttributes,
          },
          { label: t('create.stepper.step4Label'), component: EServiceTemplateCreateStepDocuments },
        ]
      : [
          { label: t('create.stepper.step1Label'), component: EServiceTemplateCreateStepGeneral },
          {
            label: t('create.stepper.step2ReceiveLabel'),
            component: EServiceTemplateCreateStepPurpose,
          },
          { label: t('create.stepper.step2Label'), component: EServiceTemplateCreateStepVersion },
          {
            label: t('create.stepper.step3Label'),
            component: EServiceTemplateCreateStepAttributes,
          },
          { label: t('create.stepper.step4Label'), component: EServiceTemplateCreateStepDocuments },
        ]

  const { component: Step } = steps[activeStep]

  // If this e-service is not in draft, you cannot edit it
  if (template && template.state !== 'DRAFT') {
    return (
      <Redirect
        to="NOT_FOUND" //TODO pagina di dettaglio PROVIDE_ESERVICE_TEMPLATE_MANAGE
        //params={{ eServiceTemplateId: template.id, versionId: }}
      />
    )
  }

  const isReady = Boolean(isNewEServiceTemplate || (!isLoadingTemplate && template))

  const stepsLoadingSkeletons =
    eserviceTemplateMode === 'DELIVER'
      ? [
          <EServiceTemplateCreateStepGeneralSkeleton key={1} />,
          <EServiceTemplateCreateStepVersionSkeleton key={2} />,
          <EServiceTemplateCreateStepAttributesSkeleton key={3} />,
          <EServiceTemplateCreateStepDocumentsSkeleton key={4} />,
        ]
      : [
          <EServiceTemplateCreateStepGeneralSkeleton key={1} />,
          <EServiceTemplateCreateStepPurposeSkeleton key={2} />,
          <EServiceTemplateCreateStepVersionSkeleton key={3} />,
          <EServiceTemplateCreateStepAttributesSkeleton key={4} />,
          <EServiceTemplateCreateStepDocumentsSkeleton key={5} />,
        ]

  const intro = isNewEServiceTemplate
    ? { title: t('create.emptyTitle') }
    : {
        title: template?.eserviceTemplate.name,
        description: template?.eserviceTemplate.eserviceDescription,
      }

  return (
    <PageContainer
      {...intro}
      backToAction={{
        label: t('backToListBtn'),
        to: 'NOT_FOUND', //TODO LISTING TEMPLATE
      }}
      isLoading={!isReady}
    >
      <Stepper steps={steps} activeIndex={activeStep} />
      {isReady && (
        <EServiceTemplateCreateContextProvider
          template={template}
          eserviceTemplateMode={eserviceTemplateMode}
          onEserviceTemplateModeChange={setSelectedEServiceTemplateMode}
          {...stepProps}
        >
          <Step />
        </EServiceTemplateCreateContextProvider>
      )}
      {!isReady && stepsLoadingSkeletons[activeStep]}
    </PageContainer>
  )
}

export default ProviderEServiceCreatePage
