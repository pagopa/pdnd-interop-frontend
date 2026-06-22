import React from 'react'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { useTranslation } from 'react-i18next'
import { EServiceQueries } from '@/api/eservice'
import { useParams } from '@/router'
import EngineeringIcon from '@mui/icons-material/Engineering'
import ContactMailIcon from '@mui/icons-material/ContactMail'
import SyncIcon from '@mui/icons-material/Sync'
import { useDrawerState } from '@/hooks/useDrawerState'
import { ConsumerEServiceTechnicalInfoDrawer } from './ConsumerEServiceTechnicalInfoDrawer'
import { ConsumerEServiceAsyncExchangeDetailsDrawer } from './ConsumerEServiceAsyncExchangeDetailsDrawer'
import { ConsumerEServiceProducerContactsDrawer } from './ConsumerEServiceProducerContactsDrawer'
import { useSuspenseQuery } from '@tanstack/react-query'

export const ConsumerEServiceGeneralInfoSection: React.FC = () => {
  const { t } = useTranslation('eservice', {
    keyPrefix: 'read.sections.generalInformations',
  })

  const { eserviceId, descriptorId } = useParams<'SUBSCRIBE_CATALOG_VIEW'>()
  const { data: descriptor } = useSuspenseQuery(
    EServiceQueries.getDescriptorCatalog(eserviceId, descriptorId)
  )

  const {
    isOpen: isTechnicalInfoDrawerOpen,
    openDrawer: openTechnicalInfoDrawer,
    closeDrawer: closeTechnicalInfoDrawer,
  } = useDrawerState()

  const {
    isOpen: isProducerContactsDrawerOpen,
    openDrawer: openProducerContactsDrawer,
    closeDrawer: closeProducerContactsDrawer,
  } = useDrawerState()

  const {
    isOpen: isAsyncExchangeDetailsDrawerOpen,
    openDrawer: openAsyncExchangeDetailsDrawer,
    closeDrawer: closeAsyncExchangeDetailsDrawer,
  } = useDrawerState()

  const hasContactInformations = !!descriptor.eservice.mail

  const showTechnicalDetailsAction = {
    startIcon: <EngineeringIcon fontSize="small" />,
    component: 'button',
    onClick: openTechnicalInfoDrawer,
    label: t('bottomActions.showTechnicalDetails'),
  }

  const showAsyncExchangeDetailsAction = {
    startIcon: <SyncIcon fontSize="small" />,
    component: 'button',
    onClick: openAsyncExchangeDetailsDrawer,
    label: t('bottomActions.showAsyncExchangeDetails'),
  }

  const showProducerContactsAction = {
    startIcon: <ContactMailIcon fontSize="small" />,
    component: 'button',
    onClick: openProducerContactsDrawer,
    label: t('bottomActions.showProducerContacts'),
  }

  return (
    <>
      <SectionContainer
        title={t('title')}
        bottomActions={[
          showTechnicalDetailsAction,
          ...(descriptor.eservice.asyncExchange ? [showAsyncExchangeDetailsAction] : []),
          ...(hasContactInformations ? [showProducerContactsAction] : []),
        ]}
      >
        <Stack spacing={2}>
          <InformationContainer
            label={t('producer.label')}
            content={descriptor.eservice.producer.name}
          />
          <InformationContainer label={t('version.label')} content={descriptor.version} />
          <InformationContainer
            label={t(`personalDataField.${descriptor.eservice.mode}.label`)}
            content={t(`personalDataField.value.${descriptor.eservice.personalData}`)}
          />
          <InformationContainer
            label={t('exchangeType.label')}
            content={t(
              `exchangeType.value.${descriptor.eservice.asyncExchange ? 'async' : 'sync'}`
            )}
          />
          <InformationContainer
            label={t('eserviceDescription.label')}
            content={descriptor.eservice.description}
            direction="column"
          />
          <InformationContainer
            label={t('descriptorDescription.label')}
            content={descriptor.description ?? ''}
            direction="column"
          />
        </Stack>
        <SectionContainer innerSection title={t('delegationSection.title')} sx={{ mt: 3 }}>
          <Stack spacing={2}>
            <InformationContainer
              label={t('delegationSection.isConsumerDelegable.label')}
              content={t(
                `delegationSection.isConsumerDelegable.value.${descriptor.eservice.isConsumerDelegable}`
              )}
            />
            <InformationContainer
              label={t('delegationSection.isClientAccessDelegable.label')}
              content={t(
                `delegationSection.isClientAccessDelegable.value.${descriptor.eservice.isClientAccessDelegable}`
              )}
            />
          </Stack>
        </SectionContainer>
      </SectionContainer>
      <ConsumerEServiceTechnicalInfoDrawer
        isOpen={isTechnicalInfoDrawerOpen}
        onClose={closeTechnicalInfoDrawer}
        descriptor={descriptor}
      />
      <ConsumerEServiceAsyncExchangeDetailsDrawer
        isOpen={isAsyncExchangeDetailsDrawerOpen}
        onClose={closeAsyncExchangeDetailsDrawer}
        descriptor={descriptor}
      />
      <ConsumerEServiceProducerContactsDrawer
        isOpen={isProducerContactsDrawerOpen}
        onClose={closeProducerContactsDrawer}
        descriptor={descriptor}
      />
    </>
  )
}

export const ConsumerEServiceGeneralInfoSectionSkeleton = () => {
  return <SectionContainerSkeleton sx={{ mt: 4 }} height={510} />
}
