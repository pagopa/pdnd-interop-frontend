import React from 'react'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { Divider, Stack, Typography } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { useTranslation } from 'react-i18next'
import { EServiceDownloads, EServiceMutations, EServiceQueries } from '@/api/eservice'
import { useParams } from '@/router'
import FileCopyIcon from '@mui/icons-material/FileCopy'
import DownloadIcon from '@mui/icons-material/Download'
import InsertLinkIcon from '@mui/icons-material/InsertLink'
import { useDrawerState } from '@/hooks/useDrawerState'
import { EServiceVersionSelectorDrawer } from '@/components/shared/EServiceVersionSelectorDrawer'
import EditIcon from '@mui/icons-material/Edit'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useGetProducerDelegationUserRole } from '@/hooks/useGetProducerDelegationUserRole'
import { AuthHooks } from '@/api/auth'
import { trackEvent } from '@/config/tracking'
import { isAxiosError } from 'axios'
import { UpdateDescriptionDrawer } from '@/components/shared/UpdateDescriptionDrawer'
import { UpdateNameDrawer } from '@/components/shared/UpdateNameDrawer'
import { Link } from '@/router'

export const ProviderEServiceGeneralInfoSection: React.FC = () => {
  const { t } = useTranslation('eservice', {
    keyPrefix: 'read.sections.generalInformations',
  })
  const { t: tCommon } = useTranslation('common')
  const { t: tDrawer } = useTranslation('eservice', {
    keyPrefix: 'read.drawers',
  })
  const { jwt } = AuthHooks.useJwt()

  const { eserviceId, descriptorId } = useParams<'PROVIDE_ESERVICE_MANAGE'>()
  const { data: descriptor } = useSuspenseQuery(
    EServiceQueries.getDescriptorProvider(eserviceId, descriptorId)
  )

  const { isDelegator } = useGetProducerDelegationUserRole({
    eserviceId,
    organizationId: jwt?.organizationId,
  })

  const isEserviceFromTemplate = Boolean(descriptor.templateRef)

  const downloadConsumerList = EServiceDownloads.useDownloadConsumerList()
  const exportVersion = EServiceDownloads.useExportVersion()

  const { mutate: updateEserviceDescription } = EServiceMutations.useUpdateEServiceDescription()
  const { mutate: updateEserviceName } = EServiceMutations.useUpdateEServiceName()

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
  }

  const handleDescriptionUpdate = (eserviceId: string, description: string) => {
    updateEserviceDescription(
      {
        eserviceId: eserviceId,
        description: description,
      },
      { onSuccess: closeEServiceUpdateDescriptionDrawer }
    )
  }

  const handleNameUpdate = (eserviceId: string, name: string) => {
    updateEserviceName(
      {
        eserviceId: eserviceId,
        name: name,
      },
      { onSuccess: closeEServiceUpdateNameDrawer }
    )
  }

  const watchRiskyAnalysisAssociatedAction = {
    startIcon: <InsertLinkIcon fontSize="small" />,
    component: Link,
    to: 'WATCH_RISK_ANALISIS_FOR_ESERVICE',
    params: {
      descriptorId: descriptor.id,
      eserviceId: descriptor.eservice.id,
    },
    label: t('bottomActions.watchRiskyAnalysisAssociated'),
  }

  const isAtLeastOneRiskyAnalysisAssociated =
    descriptor.eservice.riskAnalysis && descriptor.eservice.riskAnalysis.length > 0
  return (
    <>
      <SectionContainer
        title={t('title')}
        bottomActions={[
          ...(!hasSingleVersion ? [navigateVersionsAction] : []),
          ...(isAtLeastOneRiskyAnalysisAssociated ? [exportVersionListAction] : []),
          ...(descriptor.eservice.mode === 'RECEIVE' ? [watchRiskyAnalysisAssociatedAction] : []),
          downloadConsumerListAction,
          ...(!isEserviceFromTemplate ? [exportVersionListAction] : []),
        ]}
      >
        <Stack spacing={2}>
          <InformationContainer label={t('version.label')} content={descriptor.version} />
          {isEserviceFromTemplate ? (
            <>
              <InformationContainer
                label={t('eserviceTempalteName.label')}
                content={
                  <Link
                    to="PROVIDE_ESERVICE_TEMPLATE_DETAILS"
                    params={{
                      eServiceTemplateId: descriptor.templateRef?.templateId as string,
                      eServiceTemplateVersionId: descriptor.templateRef
                        ?.templateVersionId as string,
                    }}
                  >
                    {descriptor.templateRef?.templateName}
                  </Link>
                }
              />
            </>
          ) : (
            <>
              <Divider />
              <SectionContainer
                innerSection
                title={t('eserviceName.label')}
                titleTypographyProps={{ variant: 'body1', fontWeight: 600 }}
                topSideActions={
                  isDelegator
                    ? []
                    : [
                        {
                          action: openEServiceUpdateNameDrawer,
                          label: tCommon('actions.edit'),
                          icon: EditIcon,
                        },
                      ]
                }
              >
                <Typography variant="body2">{descriptor.eservice.name}</Typography>
              </SectionContainer>
            </>
          )}
          <Divider />
          <SectionContainer
            innerSection
            title={t('eserviceDescription.label')}
            titleTypographyProps={{ variant: 'body1', fontWeight: 600 }}
            topSideActions={
              isDelegator || isEserviceFromTemplate
                ? []
                : [
                    {
                      action: openEServiceUpdateDescriptionDrawer,
                      label: tCommon('actions.edit'),
                      icon: EditIcon,
                    },
                  ]
            }
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
      <UpdateDescriptionDrawer
        isOpen={isEServiceUpdateDescriptionDrawerOpen}
        onClose={closeEServiceUpdateDescriptionDrawer}
        id={descriptor.eservice.id}
        description={descriptor.eservice.description}
        title={tDrawer('updateEServiceDescriptionDrawer.title')}
        subtitle={tDrawer('updateEServiceDescriptionDrawer.subtitle')}
        label={tDrawer('updateEServiceDescriptionDrawer.eserviceDescriptionField.label')}
        infoLabel={tDrawer('updateEServiceDescriptionDrawer.eserviceDescriptionField.infoLabel')}
        validateLabel={tDrawer(
          'updateEServiceDescriptionDrawer.eserviceDescriptionField.validation.sameValue'
        )}
        onSubmit={handleDescriptionUpdate}
      />
      <UpdateNameDrawer
        isOpen={isEServiceUpdateNameDrawerOpen}
        onClose={closeEServiceUpdateNameDrawer}
        id={descriptor.eservice.id}
        name={descriptor.eservice.name}
        title={tDrawer('updateEServiceNameDrawer.title')}
        subtitle={tDrawer('updateEServiceNameDrawer.subtitle')}
        label={tDrawer('updateEServiceNameDrawer.eserviceNameField.label')}
        infoLabel={tDrawer('updateEServiceNameDrawer.eserviceNameField.infoLabel')}
        validateLabel={tDrawer('updateEServiceNameDrawer.eserviceNameField.validation.sameValue')}
        onSubmit={handleNameUpdate}
      />
    </>
  )
}

export const ProviderEServiceGeneralInfoSectionSkeleton = () => {
  return <SectionContainerSkeleton sx={{ mt: 4 }} height={383} />
}
