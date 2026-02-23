import React from 'react'
import { PageContainer } from '@/components/layout/containers'
import type { StepperStep } from '@/types/common.types'
import type { EServiceMode } from '@/api/api.generatedTypes'
import { useQuery } from '@tanstack/react-query'
import { useActiveStep } from '@/hooks/useActiveStep'
import { EServiceTemplateQueries } from '@/api/eserviceTemplate'
import { Redirect, useParams } from '@/router'
import { Typography } from '@mui/material'
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
  EServiceTemplateCreateStepThresholdsAndAttributes,
  EServiceTemplateCreateStepThresholdsAndAttributesSkeleton,
} from './components/EServiceTemplateCreateStepThresholdsAndAttributes'
import {
  EServiceTemplateCreateStepPurpose,
  EServiceTemplateCreateStepPurposeSkeleton,
} from './components/EServiceTemplateCreateStepPurpose/EServiceTemplateCreateStepPurpose'
import {
  EServiceTemplateCreateStepDocuments,
  EServiceTemplateCreateStepDocumentsSkeleton,
} from './components/EServiceTemplateCreateStepDocuments/EServiceTemplateCreateStepDocuments'

const ProviderEServiceCreatePage: React.FC = () => {
  const { t } = useTranslation('eserviceTemplate')
  const params = useParams<'PROVIDE_ESERVICE_TEMPLATE_CREATE' | 'PROVIDE_ESERVICE_TEMPLATE_EDIT'>()
  const { activeStep, ...stepProps } = useActiveStep()

  const isNewEServiceTemplate = !params?.eServiceTemplateId

  const [selectedEServiceTemplateMode, setSelectedEServiceTemplateMode] = React.useState<
    EServiceMode | undefined
  >()

  const { data: eserviceTemplate, isLoading: isLoadingTemplate } = useQuery({
    ...EServiceTemplateQueries.getSingle(
      params?.eServiceTemplateId as string,
      params?.eServiceTemplateVersionId as string
    ),
    enabled: !isNewEServiceTemplate,
  })

  const eserviceTemplateMode =
    selectedEServiceTemplateMode || // The mode selected by the user
    eserviceTemplate?.eserviceTemplate.mode || // The mode of the e-service
    'DELIVER' // Default mode

  const steps: Array<StepperStep> =
    eserviceTemplateMode === 'DELIVER'
      ? [
          {
            label: t('create.stepper.step1Label'),
            component: EServiceTemplateCreateStepGeneral,
            showRequiredLabel: true,
          },
          {
            label: t('create.stepper.step2Label'),
            component: EServiceTemplateCreateStepThresholdsAndAttributes,
            showRequiredLabel: true,
          },
          {
            label: t('create.stepper.step3Label'),
            component: EServiceTemplateCreateStepDocuments,
            showRequiredLabel: true,
          },
          {
            label: t('create.stepper.step4Label'),
            component: EServiceTemplateCreateStepVersion,
            showRequiredLabel: true,
          },
        ]
      : [
          {
            label: t('create.stepper.step1Label'),
            component: EServiceTemplateCreateStepGeneral,
            showRequiredLabel: true,
          },
          {
            label: t('create.stepper.step2ReceiveLabel'),
            component: EServiceTemplateCreateStepPurpose,
            showRequiredLabel: true,
          },
          {
            label: t('create.stepper.step2Label'),
            component: EServiceTemplateCreateStepThresholdsAndAttributes,
            showRequiredLabel: true,
          },
          {
            label: t('create.stepper.step3Label'),
            component: EServiceTemplateCreateStepDocuments,
            showRequiredLabel: true,
          },
          {
            label: t('create.stepper.step4Label'),
            component: EServiceTemplateCreateStepVersion,
            showRequiredLabel: true,
          },
        ]

  const { component: Step, showRequiredLabel } = steps[activeStep]

  // If this e-service is not in draft, you cannot edit it
  if (eserviceTemplate && eserviceTemplate.state !== 'DRAFT') {
    return (
      <Redirect
        to="PROVIDE_ESERVICE_TEMPLATE_DETAILS"
        params={{
          eServiceTemplateId: eserviceTemplate.id,
          eServiceTemplateVersionId: eserviceTemplate.eserviceTemplate.id,
        }}
      />
    )
  }

  const isReady = Boolean(isNewEServiceTemplate || (!isLoadingTemplate && eserviceTemplate))

  const stepsLoadingSkeletons =
    eserviceTemplateMode === 'DELIVER'
      ? [
          <EServiceTemplateCreateStepGeneralSkeleton key={1} />,
          <EServiceTemplateCreateStepThresholdsAndAttributesSkeleton key={2} />,
          <EServiceTemplateCreateStepDocumentsSkeleton key={3} />,
          <EServiceTemplateCreateStepVersionSkeleton key={4} />,
        ]
      : [
          <EServiceTemplateCreateStepGeneralSkeleton key={1} />,
          <EServiceTemplateCreateStepPurposeSkeleton key={2} />,
          <EServiceTemplateCreateStepThresholdsAndAttributesSkeleton key={3} />,
          <EServiceTemplateCreateStepDocumentsSkeleton key={4} />,
          <EServiceTemplateCreateStepVersionSkeleton key={5} />,
        ]

  const intro = isNewEServiceTemplate
    ? { title: t('create.emptyTitle') }
    : {
        title: eserviceTemplate?.eserviceTemplate.name,
        description: eserviceTemplate?.eserviceTemplate.description,
      }

  return (
    <PageContainer
      {...intro}
      backToAction={{
        label: t('backToListBtn'),
        to: 'PROVIDE_ESERVICE_TEMPLATE_LIST',
      }}
      isLoading={!isReady}
    >
      {showRequiredLabel && (
        <Typography
          sx={{
            fontSize: 16,
            fontWeight: 700,
            color: 'text.secondary',
          }}
        >
          {t('create.requiredLabel')}
        </Typography>
      )}
      <Stepper steps={steps} activeIndex={activeStep} />
      {isReady && (
        <EServiceTemplateCreateContextProvider
          eserviceTemplateVersion={eserviceTemplate}
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
