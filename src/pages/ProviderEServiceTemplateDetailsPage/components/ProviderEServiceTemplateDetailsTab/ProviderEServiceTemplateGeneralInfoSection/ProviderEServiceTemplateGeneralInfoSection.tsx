import React from 'react'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { Divider, Stack, Typography } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { useTranslation } from 'react-i18next'
import { useParams } from '@/router'
import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { AuthHooks } from '@/api/auth'
import { TemplateQueries } from '@/api/template'
import FileCopyIcon from '@mui/icons-material/FileCopy'
import DownloadIcon from '@mui/icons-material/Download'
import EngineeringIcon from '@mui/icons-material/Engineering'
import EditIcon from '@mui/icons-material/Edit'
import { useDrawerState } from '@/hooks/useDrawerState'
import { ProviderEServiceAndTemplateUpdateNameDrawer } from '@/components/shared/ProviderEServiceAndTemplateUpdateNameDrawer'
import { ProviderEServiceTemplateUpdateAudienceDrawer } from './ProviderEServiceTemplateUpdateAudienceDrawer'
//import { ProviderEServiceTemplateUpdateDescriptionDrawer } from '@/pages/ProviderEServiceDetailsPage/components/ProviderEServiceDetailsTab/ProviderEServiceGeneralInfoSection/ProviderEServiceUpdateDescriptionDrawer'

export const ProviderEServiceTemplateGeneralInfoSection: React.FC = () => {
  const { t } = useTranslation('template', {
    keyPrefix: 'read.sections.generalInformations',
  })
  const { t: tCommon } = useTranslation('common')
  const { jwt } = AuthHooks.useJwt()

  const { eserviceTemplateId } = useParams<'PROVIDE_ESERVICE_TEMPLATE_DETAILS'>()
  //const { data: template } = useSuspenseQuery(TemplateQueries.getSingle(eserviceTemplateId))
  const { data: template } = useQuery(TemplateQueries.getSingle(eserviceTemplateId))

  /*const downloadConsumerList = EServiceDownloads.useDownloadConsumerList()
  const exportVersion = EServiceDownloads.useExportVersion()

  const {
    isOpen: isVersionSelectorDrawerOpen,
    openDrawer: openVersionSelectorDrawer,
    closeDrawer: closeVersionSelectorDrawer,
  } = useDrawerState()*/

  const {
    isOpen: isEServiceTemplateUpdateNameDrawerOpen,
    openDrawer: openEServiceUpdateNameDrawer,
    closeDrawer: closeEServiceUpdateNameDrawer,
  } = useDrawerState()

  const {
    isOpen: isEServiceTemplateUpdateAudienceDrawerOpen,
    openDrawer: openEServiceUpdateAudienceDrawer,
    closeDrawer: closeEServiceUpdateAudienceDrawer,
  } = useDrawerState()

  const {
    isOpen: isEServiceTemplateUpdateDescriptionDrawerOpen,
    openDrawer: openEServiceTemplateUpdateDescriptionDrawer,
    closeDrawer: closeEServiceTemplateUpdateDescriptionDrawer,
  } = useDrawerState()

  /*const handleDownloadConsumerList = () => {
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
  }*/

  const hasSingleVersion = template!.versions.length <= 1 //TODO

  const navigateTemplateVersionsAction = {
    startIcon: <FileCopyIcon fontSize="small" />,
    component: 'button',
    onClick: () => {}, //openVersionSelectorDrawer, TODO
    label: t('bottomActions.navigateTemplateVersions'),
  }

  const downloadUsingTenantsListAction = {
    startIcon: <DownloadIcon fontSize="small" />,
    component: 'button',
    onClick: () => {}, //handleDownloadUsingTenantsList, TODO
    label: t('bottomActions.downloadUsingTenantsList'),
  }

  const viewTechnicalInfoAction = {
    startIcon: <EngineeringIcon fontSize="small" />,
    component: 'button',
    onClick: () => {}, //handleViewTechincalInfo, TODO
    label: t('bottomActions.viewTechnicalInfo'),
  }

  return (
    <>
      <SectionContainer
        title={t('title')}
        bottomActions={[
          ...(!hasSingleVersion ? [navigateTemplateVersionsAction] : []),
          downloadUsingTenantsListAction,
          viewTechnicalInfoAction,
        ]}
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
            topSideActions={[
              {
                action: openEServiceUpdateNameDrawer, //openEServiceUpdateNameDrawer,
                label: tCommon('actions.edit'),
                icon: EditIcon,
              },
            ]} //TODO
          >
            <Typography variant="body2">{template?.name}</Typography>
          </SectionContainer>
          <Divider />
          <SectionContainer
            innerSection
            title={t('eserviceTemplateAudienceDescription.label')}
            titleTypographyProps={{ variant: 'body1', fontWeight: 600 }}
            topSideActions={[
              {
                action: openEServiceUpdateAudienceDrawer,
                label: tCommon('actions.edit'),
                icon: EditIcon,
              },
            ]} //TODO
          >
            <Typography variant="body2">{template?.audienceDescription}</Typography>
          </SectionContainer>
          <Divider />
          <SectionContainer
            innerSection
            title={t('eserviceTemplateDescription.label')}
            titleTypographyProps={{ variant: 'body1', fontWeight: 600 }}
            topSideActions={[
              {
                action: openEServiceTemplateUpdateDescriptionDrawer,
                label: tCommon('actions.edit'),
                icon: EditIcon,
              },
            ]} //TODO
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
      {template && (
        <>
          <ProviderEServiceAndTemplateUpdateNameDrawer
            isOpen={isEServiceTemplateUpdateNameDrawerOpen}
            onClose={closeEServiceUpdateNameDrawer}
            template={template}
          />
          <ProviderEServiceTemplateUpdateAudienceDrawer
            isOpen={isEServiceTemplateUpdateAudienceDrawerOpen}
            onClose={closeEServiceUpdateAudienceDrawer}
            template={template}
          />
        </>
      )}
    </>
  )
}

export const ProviderEServiceTemplateGeneralInfoSectionSkeleton = () => {
  return <SectionContainerSkeleton sx={{ mt: 4 }} height={383} />
}
