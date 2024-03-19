import React from 'react'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { useTranslation } from 'react-i18next'
import { EServiceDownloads, EServiceQueries } from '@/api/eservice'
import { useParams } from '@/router'
import FileCopyIcon from '@mui/icons-material/FileCopy'
import DownloadIcon from '@mui/icons-material/Download'
import { useDrawerState } from '@/hooks/useDrawerState'
import { EServiceVersionSelectorDrawer } from '@/components/shared/EServiceVersionSelectorDrawer'

export const ProviderEServiceGeneralInfoSection: React.FC = () => {
  const { t } = useTranslation('eservice', {
    keyPrefix: 'read.sections.generalInformations',
  })

  const { eserviceId, descriptorId } = useParams<'PROVIDE_ESERVICE_MANAGE'>()
  const { data: descriptor } = EServiceQueries.useGetDescriptorProvider(eserviceId, descriptorId, {
    suspense: true,
  })

  const downloadConsumerList = EServiceDownloads.useDownloadConsumerList()

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

  const hasSingleVersion =
    descriptor.eservice.descriptors.filter((d) => d.state !== 'DRAFT').length <= 1

  const navigateVersionsAction = {
    startIcon: <FileCopyIcon fontSize="small" />,
    component: 'button',
    onClick: openVersionSelectorDrawer,
    label: t('bottomActions.navigateVersions'),
  }

  const downloadConsumerListAction = {
    startIcon: <DownloadIcon fontSize="small" />,
    component: 'button',
    onClick: handleDownloadConsumerList,
    label: t('bottomActions.downloadConsumerList'),
  }

  return (
    <>
      <SectionContainer
        title={t('title')}
        bottomActions={[
          ...(!hasSingleVersion ? [navigateVersionsAction] : []),
          downloadConsumerListAction,
        ]}
      >
        <Stack spacing={2}>
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
      <EServiceVersionSelectorDrawer
        isOpen={isVersionSelectorDrawerOpen}
        onClose={closeVersionSelectorDrawer}
        descriptor={descriptor}
      />
    </>
  )
}

export const ProviderEServiceGeneralInfoSectionSkeleton = () => {
  return <SectionContainerSkeleton sx={{ mt: 4 }} height={383} />
}
