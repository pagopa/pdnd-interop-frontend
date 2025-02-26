import { useActiveStep } from '@/hooks/useActiveStep'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useParams } from '@/router'
import { Link } from '@mui/material'
import { TemplateQueries } from '@/api/template'
import type { StepperStep } from '@/types/common.types'
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
import type { EServiceMode, ProducerEServiceDescriptor } from '@/api/api.generatedTypes'

const ProviderEServiceFromTemplateCreate: React.FC = () => {
  const { t } = useTranslation('eservice')
  const { t: tTemplate } = useTranslation('template')
  const { eServiceTemplateId, eserviceId, descriptorId } = useParams<
    'PROVIDE_ESERVICE_FROM_TEMPLATE_CREATE' | 'PROVIDE_ESERVICE_FROM_TEMPLATE_EDIT'
  >()
  const { activeStep, ...stepProps } = useActiveStep()

  const isNewEService = !eserviceId || !descriptorId

  const { data: template } = useQuery({
    ...TemplateQueries.getSingleByEServiceTemplateId(eServiceTemplateId),
  })

  // const { data: descriptor, isLoading: isLoadingDescriptor } = useQuery({
  //   ...EServiceQueries.getDescriptorProvider(eserviceId as string, descriptorId as string),
  //   enabled: !isNewEService,
  // })

  const isLoadingDescriptor = false

  const descriptor: ProducerEServiceDescriptor | undefined = eserviceId
    ? {
        id: '162171d0-b3fc-4698-a98f-63b4f016db69',
        version: '1',
        description: 'sdfdsfssdfdsf',
        docs: [],
        state: 'DRAFT',
        audience: ['dsfdsf'],
        voucherLifespan: 60,
        dailyCallsPerConsumer: 1,
        dailyCallsTotal: 1,
        agreementApprovalPolicy: 'AUTOMATIC',
        eservice: {
          id: 'fc60ac59-e989-46db-96f6-367c20bce324',
          name: 'dssdsdfds',
          description: 'ddssdfdssdfdsd',
          producer: {
            id: '69e2865e-65ab-4e48-a638-2037a9ee2ee7',
            tenantKind: 'GSP',
          },
          technology: 'REST',
          mode: 'DELIVER',
          riskAnalysis: [],
          descriptors: [],
          draftDescriptor: {
            id: '162171d0-b3fc-4698-a98f-63b4f016db69',
            state: 'DRAFT',
            version: '1',
            audience: ['dsfdsf'],
          },
          mail: {
            address: 'lamail2@mail.it',
            description: 'descrizione modificata',
          },
          isSignalHubEnabled: false,
          isConsumerDelegable: false,
          isClientAccessDelegable: false,
        },
        attributes: {
          certified: [],
          declared: [],
          verified: [],
        },
      }
    : undefined

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
  const isTemplateReady = Boolean(template)

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
      {isReady && isTemplateReady && (
        <EServiceCreateContextProvider
          template={template}
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
