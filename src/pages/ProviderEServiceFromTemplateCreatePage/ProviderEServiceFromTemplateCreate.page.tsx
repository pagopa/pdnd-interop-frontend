import { useActiveStep } from '@/hooks/useActiveStep'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useParams, useGeneratePath } from '@/router'
import { Link } from '@mui/material'
import { EServiceTemplateQueries } from '@/api/eserviceTemplate'
import type { StepperStep } from '@/types/common.types'
import { EServiceFromTemplateCreateStepDocuments } from '../ProviderEServiceCreatePage/components/EServiceCreateStepDocuments'
import {
  EServiceCreateStepOne,
  EServiceCreateStepOneSkeleton,
} from '../ProviderEServiceCreatePage/components/EServiceCreateStepOne'
import {
  EServiceCreateStepPurpose,
  EServiceCreateStepPurposeSkeleton,
} from '../ProviderEServiceCreatePage/components/EServiceCreateStepPurpose/EServiceCreateStepPurpose'
import { PageContainer } from '@/components/layout/containers'
import { Stepper } from '@/components/shared/Stepper'
import { EServiceCreateContextProvider } from '../ProviderEServiceCreatePage/components/EServiceCreateContext'
import type { EServiceMode } from '@/api/api.generatedTypes'
import {
  EServiceCreateStepThree,
  EServiceCreateStepThreeSkeleton,
} from '../ProviderEServiceCreatePage/components/EServiceCreateStepThree'
import {
  EServiceCreateStepTwo,
  EServiceCreateStepTwoSkeleton,
} from '../ProviderEServiceCreatePage/components/EServiceCreateStepTwo'
import { EServiceCreateStepFourSkeleton } from '../ProviderEServiceCreatePage/components/EServiceCreateStepFour'

const ProviderEServiceFromTemplateCreate: React.FC = () => {
  const { t } = useTranslation('eservice')
  const { t: tTemplate } = useTranslation('eserviceTemplate')
  const { eServiceTemplateId } = useParams<'PROVIDE_ESERVICE_FROM_TEMPLATE_CREATE'>()
  const { activeStep, ...stepProps } = useActiveStep()
  const generatePath = useGeneratePath()

  const { data: eserviceTemplate } = useQuery({
    ...EServiceTemplateQueries.getSingleByEServiceTemplateId(eServiceTemplateId),
  })

  const steps: Array<StepperStep> =
    eserviceTemplate?.mode === 'DELIVER'
      ? [
          { label: t('create.stepper.step1Label'), component: EServiceCreateStepOne },
          { label: t('create.stepper.step2Label'), component: EServiceCreateStepTwo },
          { label: t('create.stepper.step3Label'), component: EServiceCreateStepThree },
          {
            label: t('create.stepper.step4Label'),
            component: EServiceFromTemplateCreateStepDocuments,
          },
        ]
      : [
          { label: t('create.stepper.step1Label'), component: EServiceCreateStepOne },
          { label: t('create.stepper.step2ReceiveLabel'), component: EServiceCreateStepPurpose },
          { label: t('create.stepper.step2Label'), component: EServiceCreateStepTwo },
          { label: t('create.stepper.step3Label'), component: EServiceCreateStepThree },
          {
            label: t('create.stepper.step4Label'),
            component: EServiceFromTemplateCreateStepDocuments,
          },
        ]

  const { component: Step } = steps[activeStep]

  const isTemplateReady = Boolean(eserviceTemplate)

  const activeTemplateversionId = eserviceTemplate?.versions.find((v) => v.state === 'PUBLISHED')
    ?.id as string

  const stepsLoadingSkeletons =
    eserviceTemplate?.mode === 'DELIVER'
      ? [
          <EServiceCreateStepOneSkeleton key={1} />,
          <EServiceCreateStepTwoSkeleton key={2} />,
          <EServiceCreateStepThreeSkeleton key={3} />,
          <EServiceCreateStepFourSkeleton key={4} />,
        ]
      : [
          <EServiceCreateStepOneSkeleton key={1} />,
          <EServiceCreateStepPurposeSkeleton key={2} />,
          <EServiceCreateStepTwoSkeleton key={3} />,
          <EServiceCreateStepThreeSkeleton key={4} />,
          <EServiceCreateStepFourSkeleton key={5} />,
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
                      eServiceTemplateId: eserviceTemplate?.id as string,
                      eServiceTemplateVersionId: activeTemplateversionId,
                    })
                  }
                  target="_blank"
                />
              ),
            }}
          >
            {tTemplate('createInstance.eserviceTemplateDescriptionLink', {
              templateName: eserviceTemplate?.name,
            })}
          </Trans>
        )
      }
      backToAction={{
        label: t('backToListBtn'),
        to: 'PROVIDE_ESERVICE_LIST',
      }}
    >
      <Stepper steps={steps} activeIndex={activeStep} />
      {isTemplateReady && (
        <EServiceCreateContextProvider
          eserviceTemplate={eserviceTemplate}
          descriptor={undefined}
          eserviceMode={eserviceTemplate?.mode as EServiceMode}
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
