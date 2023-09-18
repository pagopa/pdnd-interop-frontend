import React from 'react'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { useTranslation } from 'react-i18next'
import { EServiceQueries } from '@/api/eservice'
import { useParams } from '@/router'
import FileCopyIcon from '@mui/icons-material/FileCopy'
import EngineeringIcon from '@mui/icons-material/Engineering'
import ContactMailIcon from '@mui/icons-material/ContactMail'
import { useDrawerState } from '@/hooks/useDrawerState'
import { ConsumerEServiceTechnicalInfoDrawer } from './ConsumerEServiceTechnicalInfoDrawer'
import { ConsumerEServiceProducerContactsDrawer } from './ConsumerEServiceProducerContactsDrawer'
import { ConsumerEServiceVersionSelectorDrawer } from './ConsumerEServiceVersionSelectorDrawer'

export const ConsumerEServiceDetails: React.FC = () => {
  const { t } = useTranslation('eservice', {
    keyPrefix: 'read.sections.generalInformations',
  })

  const { eserviceId, descriptorId } = useParams<'SUBSCRIBE_CATALOG_VIEW'>()
  const { data: descriptor } = EServiceQueries.useGetDescriptorCatalog(eserviceId, descriptorId)

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
    isOpen: isVersionSelectorDrawerOpen,
    openDrawer: openVersionSelectorDrawer,
    closeDrawer: closeVersionSelectorDrawer,
  } = useDrawerState()

  if (!descriptor) return null

  return (
    <>
      <SectionContainer
        newDesign
        title={t('title')}
        bottomActions={[
          {
            startIcon: <FileCopyIcon fontSize="small" />,
            component: 'button',
            onClick: openVersionSelectorDrawer,
            label: t('bottomActions.navigateVersions'),
          },
          {
            startIcon: <EngineeringIcon fontSize="small" />,
            component: 'button',
            onClick: openTechnicalInfoDrawer,
            label: t('bottomActions.showTechnicalDetails'),
          },
          {
            startIcon: <ContactMailIcon fontSize="small" />,
            component: 'button',
            onClick: openProducerContactsDrawer,
            label: t('bottomActions.showProducerContacts'),
          },
        ]}
      >
        <Stack spacing={2}>
          <InformationContainer
            label={t('producer.label')}
            content={descriptor.eservice.producer.name}
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
      </SectionContainer>
      <ConsumerEServiceTechnicalInfoDrawer
        isOpen={isTechnicalInfoDrawerOpen}
        onClose={closeTechnicalInfoDrawer}
        descriptor={descriptor}
      />
      <ConsumerEServiceProducerContactsDrawer
        isOpen={isProducerContactsDrawerOpen}
        onClose={closeProducerContactsDrawer}
        descriptor={descriptor}
      />
      <ConsumerEServiceVersionSelectorDrawer
        isOpen={isVersionSelectorDrawerOpen}
        onClose={closeVersionSelectorDrawer}
        descriptor={descriptor}
      />
    </>
  )
}

export const ConsumerEServiceDetailsSkeleton = () => {
  return <SectionContainerSkeleton height={499} />
}
