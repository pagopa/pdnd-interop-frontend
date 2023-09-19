import React from 'react'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { useTranslation } from 'react-i18next'
import { EServiceDownloads, EServiceQueries } from '@/api/eservice'
import { useParams } from '@/router'
import FileCopyIcon from '@mui/icons-material/FileCopy'
import EngineeringIcon from '@mui/icons-material/Engineering'
import DownloadIcon from '@mui/icons-material/Download'
import { useDrawerState } from '@/hooks/useDrawerState'
import { ProviderEServiceTechnicalInfoDrawer } from './ProviderEServiceTechnicalInfoDrawer'
import { EServiceVersionSelectorDrawer } from '@/components/shared/EServiceVersionSelectorDrawer'

export const ProviderEServiceGeneralInfoSection: React.FC = () => {
  const { t } = useTranslation('eservice', {
    keyPrefix: 'read.sections.generalInformations',
  })

  const { eserviceId, descriptorId } = useParams<'PROVIDE_ESERVICE_MANAGE'>()
  const { data: descriptor } = EServiceQueries.useGetDescriptorProvider(eserviceId, descriptorId)

  const downloadConsumerList = EServiceDownloads.useDownloadConsumerList()

  const {
    isOpen: isTechnicalInfoDrawerOpen,
    openDrawer: openTechnicalInfoDrawer,
    closeDrawer: closeTechnicalInfoDrawer,
  } = useDrawerState()

  const {
    isOpen: isVersionSelectorDrawerOpen,
    openDrawer: openVersionSelectorDrawer,
    closeDrawer: closeVersionSelectorDrawer,
  } = useDrawerState()

  if (!descriptor) return null

  const handleDownloadConsumerList = () => {
    downloadConsumerList(
      { eserviceId },
      t('consumerListFileName', {
        timestamp: new Date().toISOString(),
        eserviceName: descriptor.eservice.name,
      })
    )
  }

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
            startIcon: <DownloadIcon fontSize="small" />,
            component: 'button',
            onClick: handleDownloadConsumerList,
            label: t('bottomActions.downloadConsumerList'),
          },
          {
            startIcon: <EngineeringIcon fontSize="small" />,
            component: 'button',
            onClick: openTechnicalInfoDrawer,
            label: t('bottomActions.showTechnicalDetails'),
          },
        ]}
      >
        <Stack spacing={2}>
          <InformationContainer
            label={t('version.label', { versionNumber: descriptor.version })}
            content={descriptor.version}
            direction="column"
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
      <ProviderEServiceTechnicalInfoDrawer
        isOpen={isTechnicalInfoDrawerOpen}
        onClose={closeTechnicalInfoDrawer}
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

export const ProviderEServiceGeneralInfoSectionSkeleton = () => {
  return <SectionContainerSkeleton height={499} />
}
