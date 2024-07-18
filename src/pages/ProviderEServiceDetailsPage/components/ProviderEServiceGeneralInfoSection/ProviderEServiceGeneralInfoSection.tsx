import React from 'react'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { Divider, Stack, Typography } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { useTranslation } from 'react-i18next'
import { EServiceDownloads, EServiceQueries } from '@/api/eservice'
import { useParams } from '@/router'
import FileCopyIcon from '@mui/icons-material/FileCopy'
import DownloadIcon from '@mui/icons-material/Download'
import { useDrawerState } from '@/hooks/useDrawerState'
import { EServiceVersionSelectorDrawer } from '@/components/shared/EServiceVersionSelectorDrawer'
import EditIcon from '@mui/icons-material/Edit'
import { ProviderEServiceUpdateDescriptionDrawer } from './ProviderEServiceUpdateDescriptionDrawer'

export const ProviderEServiceGeneralInfoSection: React.FC = () => {
  const { t } = useTranslation('eservice', {
    keyPrefix: 'read.sections.generalInformations',
  })
  const { t: tCommon } = useTranslation('common')

  const { eserviceId, descriptorId } = useParams<'PROVIDE_ESERVICE_MANAGE'>()
  const { data: descriptor } = EServiceQueries.useGetDescriptorProvider(eserviceId, descriptorId, {
    suspense: true,
  })

  const downloadConsumerList = EServiceDownloads.useDownloadConsumerList()

  const exportVersion = EServiceDownloads.useExportVersion()

  const {
    isOpen: isVersionSelectorDrawerOpen,
    openDrawer: openVersionSelectorDrawer,
    closeDrawer: closeVersionSelectorDrawer,
  } = useDrawerState()

  const {
    isOpen: isEServiceUpdateDescriptionDrawerOpen,
    openDrawer: openEServiceUpdateDescriptionDrawer,
    closeDrawer: closeEServiceUpdateDescriptionDrawer,
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

  const handleExportVersion = () => {
    exportVersion({ eserviceId, descriptorId })
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

  const exportVersionListAction = {
    startIcon: <DownloadIcon fontSize="small" />,
    component: 'button',
    onClick: handleExportVersion,
    label: t('bottomActions.exportVersion'),
  }

  return (
    <>
      <SectionContainer
        title={t('title')}
        bottomActions={[
          ...(!hasSingleVersion ? [navigateVersionsAction] : []),
          downloadConsumerListAction,
          exportVersionListAction,
        ]}
      >
        <Stack spacing={2}>
          <InformationContainer label={t('version.label')} content={descriptor.version} />
          <Divider />
          <SectionContainer
            innerSection
            title={t('eserviceDescription.label')}
            titleTypographyProps={{ variant: 'body1', fontWeight: 600 }}
            topSideActions={[
              {
                action: openEServiceUpdateDescriptionDrawer,
                label: tCommon('actions.edit'),
                icon: EditIcon,
              },
            ]}
          >
            <Typography variant="body2">{descriptor.eservice.description}</Typography>
          </SectionContainer>
          <Divider />
          <SectionContainer
            innerSection
            title={t('descriptorDescription.label')}
            titleTypographyProps={{ variant: 'body1', fontWeight: 600 }}
          >
            <Typography variant="body2">{descriptor.description ?? ''}</Typography>
          </SectionContainer>
        </Stack>
      </SectionContainer>
      <EServiceVersionSelectorDrawer
        isOpen={isVersionSelectorDrawerOpen}
        onClose={closeVersionSelectorDrawer}
        descriptor={descriptor}
      />
      <ProviderEServiceUpdateDescriptionDrawer
        isOpen={isEServiceUpdateDescriptionDrawerOpen}
        onClose={closeEServiceUpdateDescriptionDrawer}
        eservice={descriptor.eservice}
      />
    </>
  )
}

export const ProviderEServiceGeneralInfoSectionSkeleton = () => {
  return <SectionContainerSkeleton sx={{ mt: 4 }} height={383} />
}
