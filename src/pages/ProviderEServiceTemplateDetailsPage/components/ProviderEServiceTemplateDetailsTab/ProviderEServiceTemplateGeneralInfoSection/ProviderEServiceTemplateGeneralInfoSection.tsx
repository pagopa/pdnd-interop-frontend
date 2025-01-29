import React from 'react'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { Divider, Stack, Typography } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { useTranslation } from 'react-i18next'
import { useParams } from '@/router'
import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { AuthHooks } from '@/api/auth'
import { TemplateQueries } from '@/api/template'

export const ProviderEServiceTemplateGeneralInfoSection: React.FC = () => {
  const { t } = useTranslation('template', {
    keyPrefix: 'read.sections.generalInformations',
  })
  const { t: tCommon } = useTranslation('common')
  const { jwt } = AuthHooks.useJwt()

  //const { eserviceTemplateId } = useParams<'PROVIDE_ESERVICE_TEMPLATE_DETAILS'>()
  const eserviceTemplateId = '1'
  //const { data: template } = useSuspenseQuery(TemplateQueries.getSingle(eserviceTemplateId))
  const { data: template } = useQuery(TemplateQueries.getSingle(eserviceTemplateId))

  /*const downloadConsumerList = EServiceDownloads.useDownloadConsumerList()
  const exportVersion = EServiceDownloads.useExportVersion()

  const {
    isOpen: isVersionSelectorDrawerOpen,
    openDrawer: openVersionSelectorDrawer,
    closeDrawer: closeVersionSelectorDrawer,
  } = useDrawerState()

  const {
    isOpen: isEServiceUpdateNameDrawerOpen,
    openDrawer: openEServiceUpdateNameDrawer,
    closeDrawer: closeEServiceUpdateNameDrawer,
  } = useDrawerState()

  const {
    isOpen: isEServiceUpdateDescriptionDrawerOpen,
    openDrawer: openEServiceUpdateDescriptionDrawer,
    closeDrawer: closeEServiceUpdateDescriptionDrawer,
  } = useDrawerState()

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
    trackEvent('INTEROP_ESERVICE_DOWNLOAD_REQUEST', {
      eserviceId: eserviceId,
      descriptorId: descriptorId,
    })
    exportVersion({ eserviceId, descriptorId }, undefined, {
      onSuccess: () => {
        trackEvent('INTEROP_ESERVICE_DOWNLOAD_RESPONSE_SUCCESS', {})
      },
      onError: (error) => {
        if (isAxiosError(error) && error.response) {
          trackEvent('INTEROP_ESERVICE_DOWNLOAD_RESPONSE_ERROR', {
            errorCode: error.response.status,
          })
        }
      },
    })
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
  }*/

  return (
    <>
      <SectionContainer
        title={t('title')}
        bottomActions={['']} //TODO
      >
        <Stack spacing={2}>
          <InformationContainer
            label={t('version.label')}
            content={template?.versions[0].id || ''} //TODO
          />
          <Divider />
          <SectionContainer
            innerSection
            title={t('eserviceTemplateName.label')}
            titleTypographyProps={{ variant: 'body1', fontWeight: 600 }}
            topSideActions={['']} //TODO
          >
            <Typography variant="body2">{template?.name}</Typography>
          </SectionContainer>
          <Divider />
          <SectionContainer
            innerSection
            title={t('eserviceTemplateAudienceDescription.label')}
            titleTypographyProps={{ variant: 'body1', fontWeight: 600 }}
            topSideActions={['']} //TODO
          >
            <Typography variant="body2">{template?.audienceDescription}</Typography>
          </SectionContainer>
          <Divider />
          <SectionContainer
            innerSection
            title={t('eserviceTemplateDescription.label')}
            titleTypographyProps={{ variant: 'body1', fontWeight: 600 }}
            topSideActions={['']} //TODO
          >
            <Typography variant="body2">{template?.eserviceDescription}</Typography>
          </SectionContainer>
          <Divider />
          <SectionContainer
            innerSection
            title={t('versionDescription.label')}
            titleTypographyProps={{ variant: 'body1', fontWeight: 600 }}
          >
            <Typography variant="body2">{template?.versions[0].description ?? ''}</Typography>
          </SectionContainer>
        </Stack>
      </SectionContainer>
    </>
  )
}

export const ProviderEServiceTemplateGeneralInfoSectionSkeleton = () => {
  return <SectionContainerSkeleton sx={{ mt: 4 }} height={383} />
}
