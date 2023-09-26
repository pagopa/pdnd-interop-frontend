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
import { EServiceVersionSelectorDrawer } from '@/components/shared/EServiceVersionSelectorDrawer'

export const ConsumerEServiceGeneralInfoSection: React.FC = () => {
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

  const hasSingleVersion =
    descriptor.eservice.descriptors.filter((d) => d.state !== 'DRAFT').length <= 1

  const hasContactInformations = !!descriptor.eservice.mail

  const navigateVersionsAction = {
    startIcon: <FileCopyIcon fontSize="small" />,
    component: 'button',
    onClick: openVersionSelectorDrawer,
    label: t('bottomActions.navigateVersions'),
  }

  const showTechnicalDetailsAction = {
    startIcon: <EngineeringIcon fontSize="small" />,
    component: 'button',
    onClick: openTechnicalInfoDrawer,
    label: t('bottomActions.showTechnicalDetails'),
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
        newDesign
        title={t('title')}
        bottomActions={[
          ...(!hasSingleVersion ? [navigateVersionsAction] : []),
          showTechnicalDetailsAction,
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
      <EServiceVersionSelectorDrawer
        isOpen={isVersionSelectorDrawerOpen}
        onClose={closeVersionSelectorDrawer}
        descriptor={descriptor}
      />
    </>
  )
}

export const ConsumerEServiceGeneralInfoSectionSkeleton = () => {
  return <SectionContainerSkeleton sx={{ mt: 4 }} height={510} />
}
