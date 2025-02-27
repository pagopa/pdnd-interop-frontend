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
  EServiceFromTemplateCreateStepDocuments,
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
        id: '69159c90-7be3-4e6c-8729-ca279dc7fad1',
        templateVersionId: 'f24a7f7d-f5a4-4488-8e4b-57298c1677ce',
        version: '2',
        description: 'questa versione è nuova',
        interface: {
          id: 'f24a7f7d-f5a4-4488-8e4b-57298c1677ce',
          name: 'push-signals_1.2.0_.yaml',
          contentType: 'application/x-yaml',
          prettyName: 'Specifica API',
        },
        docs: [],
        state: 'PUBLISHED',
        audience: ['audience.test'],
        voucherLifespan: 60,
        dailyCallsPerConsumer: 1,
        dailyCallsTotal: 1,
        agreementApprovalPolicy: 'AUTOMATIC',
        eservice: {
          id: 'dcca5968-d3b3-4255-9087-31d915847c0a',
          templateId: 'f24a7f7d-f5a4-4488-8e4b-57298c1677ce',
          name: 'E-service con attributi',
          description: 'test con attributi',
          producer: {
            id: '69e2865e-65ab-4e48-a638-2037a9ee2ee7',
            tenantKind: 'GSP',
          },
          technology: 'REST',
          mode: 'DELIVER',
          riskAnalysis: [],
          descriptors: [
            {
              id: '6eca6529-9430-41a6-ad49-f2c87df10058',
              state: 'ARCHIVED',
              version: '1',
              audience: ['audience.test'],
            },
            {
              id: '69159c90-7be3-4e6c-8729-ca279dc7fad1',
              state: 'PUBLISHED',
              version: '2',
              audience: ['audience.test'],
            },
          ],
          mail: {
            address: 'lamail2@mail.it',
            description: 'descrizione modificata',
          },
          isSignalHubEnabled: false,
          isConsumerDelegable: false,
          isClientAccessDelegable: false,
        },
        attributes: {
          certified: [
            [
              {
                id: '2b17dbd4-2e42-4492-aaeb-d7cfb098a1ab',
                name: 'PagoPA S.p.A.',
                description: 'PagoPA S.p.A.',
                explicitAttributeVerification: true,
              },
            ],
          ],
          declared: [
            [
              {
                id: 'e50c7b32-b8f7-4129-9c08-ff6212b804d9',
                name: 'Attributo dichiarato demo',
                description: 'asdasd asd asd sad qsad',
                explicitAttributeVerification: true,
              },
            ],
          ],
          verified: [
            [
              {
                id: 'e25e6582-6448-40a2-b2c9-cf42d4f82b98',
                name: 'nuovo attributo verificato',
                description: 'desc attributo verificato',
                explicitAttributeVerification: true,
              },
            ],
          ],
        },
        publishedAt: '2025-02-26T14:05:16.219Z',
      }
    : undefined

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
