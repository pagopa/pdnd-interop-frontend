import { useActiveStep } from '@/hooks/useActiveStep'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useParams, useGeneratePath } from '@/router'
import { Link } from '@mui/material'
import { TemplateQueries } from '@/api/template'
import type { StepperStep } from '@/types/common.types'
import {
  EServiceCreateStepAttributes,
  EServiceCreateStepAttributesSkeleton,
} from '../ProviderEServiceCreatePage/components/EServiceCreateStepAttributes'
import {
  EServiceFromTemplateCreateStepDocuments,
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
import type { EServiceMode } from '@/api/api.generatedTypes'

const ProviderEServiceFromTemplateCreate: React.FC = () => {
  const { t } = useTranslation('eservice')
  const { t: tTemplate } = useTranslation('template')
  const { eServiceTemplateId } = useParams<'PROVIDE_ESERVICE_FROM_TEMPLATE_CREATE'>()
  const { activeStep, ...stepProps } = useActiveStep()
  const generatePath = useGeneratePath()

  const { data: template } = useQuery({
    ...TemplateQueries.getSingleByEServiceTemplateId(eServiceTemplateId),
  })

  const steps: Array<StepperStep> =
    template?.mode === 'DELIVER'
      ? [
          { label: t('create.stepper.step1Label'), component: EServiceCreateStepGeneral },
          { label: t('create.stepper.step2Label'), component: EServiceCreateStepVersion },
          { label: t('create.stepper.step3Label'), component: EServiceCreateStepAttributes },
          {
            label: t('create.stepper.step4Label'),
            component: EServiceFromTemplateCreateStepDocuments,
          },
        ]
      : [
          { label: t('create.stepper.step1Label'), component: EServiceCreateStepGeneral },
          { label: t('create.stepper.step2ReceiveLabel'), component: EServiceCreateStepPurpose },
          { label: t('create.stepper.step2Label'), component: EServiceCreateStepVersion },
          { label: t('create.stepper.step3Label'), component: EServiceCreateStepAttributes },
          {
            label: t('create.stepper.step4Label'),
            component: EServiceFromTemplateCreateStepDocuments,
          },
        ]

  const { component: Step } = steps[activeStep]

  // const isReady = Boolean(isNewEService || (!isLoadingDescriptor && descriptor))
  const isTemplateReady = Boolean(template)

  const activeTemplateversionId = template?.versions.find((v) => v.state === 'PUBLISHED')
    ?.id as string

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
      isLoading={!isTemplateReady}
      description={
        !isTemplateReady ? (
          ''
        ) : (
          <Trans
            components={{
              1: (
                <Link
                  underline="hover"
                  href={
                    '/ui' +
                    generatePath('SUBSCRIBE_ESERVICE_TEMPLATE_DETAILS', {
                      eServiceTemplateId: template?.id as string,
                      eServiceTemplateVersionId: activeTemplateversionId,
                    })
                  }
                  target="_blank"
                />
              ),
            }}
          >
            {tTemplate('createInstance.templateDescriptionLink', {
              templateName: template?.name,
            })}
          </Trans>
        )
      }
      backToAction={{
        label: t('backToListBtn'),
        to: 'PROVIDE_ESERVICE_TEMPLATE_CATALOG',
      }}
    >
      <Stepper steps={steps} activeIndex={activeStep} />
      {isTemplateReady && (
        <EServiceCreateContextProvider
          template={template}
          descriptor={undefined}
          eserviceMode={template?.mode as EServiceMode}
          onEserviceModeChange={undefined}
          {...stepProps}
        >
          <Step />
        </EServiceCreateContextProvider>
      )}
      {!isTemplateReady && stepsLoadingSkeletons[activeStep]}
    </PageContainer>
  )
}

export default ProviderEServiceFromTemplateCreate
