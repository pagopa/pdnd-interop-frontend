import React from 'react'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { Divider, Stack, Typography } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { useTranslation } from 'react-i18next'
import { useParams } from '@/router'
import { useQuery } from '@tanstack/react-query'
import { TemplateMutations, TemplateQueries } from '@/api/template'
import FileCopyIcon from '@mui/icons-material/FileCopy'
import DownloadIcon from '@mui/icons-material/Download'
import EditIcon from '@mui/icons-material/Edit'
import { useDrawerState } from '@/hooks/useDrawerState'
import { UpdateDescriptionDrawer } from '@/components/shared/UpdateDescriptionDrawer'
import { UpdateNameDrawer } from '@/components/shared/UpdateNameDrawer'
import { TemplateDownloads } from '@/api/template/template.downloads'
import { EServiceTemplateVersionSelectorDrawer } from '@/components/shared/EserviceTemplate'

type EServiceTemplateGeneralInfoSectionProps = {
  readonly: boolean
  routeKey: 'SUBSCRIBE_ESERVICE_TEMPLATE_DETAILS' | 'PROVIDE_ESERVICE_TEMPLATE_DETAILS'
}
export const EServiceTemplateGeneralInfoSection: React.FC<
  EServiceTemplateGeneralInfoSectionProps
> = ({ routeKey, readonly }) => {
  routeKey
  const { t } = useTranslation('template', {
    keyPrefix: 'read.sections.generalInformations',
  })
  const { t: tDrawer } = useTranslation('template', {
    keyPrefix: 'read.drawers',
  })
  const { t: tCommon } = useTranslation('common')

  const { eServiceTemplateId, eServiceTemplateVersionId } = useParams<typeof routeKey>()
  const { data: template } = useQuery(
    TemplateQueries.getSingle(eServiceTemplateId, eServiceTemplateVersionId)
  )

  const downloadTemplateConsumerList = TemplateDownloads.useDownloadTemplateConsumerList()

  const { mutate: updateEserviceTemplateDescription } =
    TemplateMutations.useUpdateEServiceTemplateDescription()

  const { mutate: updateEserviceTemplateIntendedTarget } =
    TemplateMutations.useUpdateEServiceTemplateIntendedTarget()

  const { mutate: updateEserviceTemplateName } = TemplateMutations.useUpdateEServiceTemplateName()

  const {
    isOpen: isVersionSelectorDrawerOpen,
    openDrawer: openVersionSelectorDrawer,
    closeDrawer: closeVersionSelectorDrawer,
  } = useDrawerState()

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

  const handleDownloadTemplateConsumerList = () => {
    downloadTemplateConsumerList(
      { eServiceTemplateId },
      t('consumerListFileName', {
        timestamp: new Date().toISOString(),
        eserviceTemplateName: template?.eserviceTemplate.name,
      })
    )
  }

  const hasSingleVersion = template && template.version === 1

  const navigateTemplateVersionsAction = {
    startIcon: <FileCopyIcon fontSize="small" />,
    component: 'button',
    onClick: openVersionSelectorDrawer,
    label: t('bottomActions.navigateTemplateVersions'),
  }

  const downloadUsingTenantsListAction = {
    startIcon: <DownloadIcon fontSize="small" />,
    component: 'button',
    onClick: handleDownloadTemplateConsumerList,
    label: t('bottomActions.downloadUsingTenantsList'),
  }

  const handleNameUpdate = (templateId: string, name: string) => {
    updateEserviceTemplateName(
      {
        eServiceTemplateId: templateId,
        name: name,
      },
      { onSuccess: closeEServiceUpdateNameDrawer }
    )
  }

  const handleDescriptionUpdate = (templateId: string, description: string) => {
    updateEserviceTemplateDescription(
      {
        eServiceTemplateId: templateId,
        description: description,
      },
      { onSuccess: closeEServiceTemplateUpdateDescriptionDrawer }
    )
  }

  const handleIntendedTargetUpdate = (templateId: string, intendedTarget: string) => {
    updateEserviceTemplateIntendedTarget(
      {
        eServiceTemplateId: templateId,
        intendedTarget: intendedTarget,
      },
      { onSuccess: closeEServiceUpdateAudienceDrawer }
    )
  }

  return (
    <>
      <SectionContainer
        title={t('title')}
        bottomActions={[
          ...(!hasSingleVersion ? [navigateTemplateVersionsAction] : []),
          downloadUsingTenantsListAction,
        ]}
      >
        <Stack spacing={2}>
          <InformationContainer
            label={t('version.label')}
            content={template?.version.toString() || '1'}
          />
          <Divider />
          <SectionContainer
            innerSection
            title={t('eserviceTemplateName.label')}
            titleTypographyProps={{ variant: 'body1', fontWeight: 600 }}
            topSideActions={
              readonly
                ? undefined
                : [
                    {
                      action: openEServiceUpdateNameDrawer,
                      label: tCommon('actions.edit'),
                      icon: EditIcon,
                    },
                  ]
            }
          >
            <Typography variant="body2">{template?.eserviceTemplate.name}</Typography>
          </SectionContainer>
          <Divider />
          <SectionContainer
            innerSection
            title={t('eserviceTemplateintendedTarget.label')}
            titleTypographyProps={{ variant: 'body1', fontWeight: 600 }}
            topSideActions={
              readonly
                ? undefined
                : [
                    {
                      action: openEServiceUpdateAudienceDrawer,
                      label: tCommon('actions.edit'),
                      icon: EditIcon,
                    },
                  ]
            }
          >
            <Typography variant="body2">{template?.eserviceTemplate.intendedTarget}</Typography>
          </SectionContainer>
          <Divider />
          <SectionContainer
            innerSection
            title={t('eserviceTemplateDescription.label')}
            titleTypographyProps={{ variant: 'body1', fontWeight: 600 }}
            topSideActions={
              readonly
                ? undefined
                : [
                    {
                      action: openEServiceTemplateUpdateDescriptionDrawer,
                      label: tCommon('actions.edit'),
                      icon: EditIcon,
                    },
                  ]
            }
          >
            <Typography variant="body2">{template?.eserviceTemplate.description}</Typography>
          </SectionContainer>
          <Divider />
          <SectionContainer
            innerSection
            title={t('versionDescription.label')}
            titleTypographyProps={{ variant: 'body1', fontWeight: 600 }}
          >
            <Typography variant="body2">{template?.description ?? ''}</Typography>
          </SectionContainer>
        </Stack>
      </SectionContainer>
      {template && !readonly && (
        <>
          <EServiceTemplateVersionSelectorDrawer
            isOpen={isVersionSelectorDrawerOpen}
            onClose={closeVersionSelectorDrawer}
            actualVersion={template.version.toString()}
            versions={template?.eserviceTemplate.versions ?? []}
            eServiceTemplateId={template.id}
          />
          <UpdateNameDrawer
            isOpen={isEServiceTemplateUpdateNameDrawerOpen}
            onClose={closeEServiceUpdateNameDrawer}
            id={template.eserviceTemplate.id}
            name={template.eserviceTemplate.name}
            onSubmit={handleNameUpdate}
            title={tDrawer('updateEServiceTemplateNameDrawer.title')}
            subtitle={tDrawer('updateEServiceTemplateNameDrawer.subtitle')}
            label={tDrawer('updateEServiceTemplateNameDrawer.templateNameField.label')}
            infoLabel={tDrawer('updateEServiceTemplateNameDrawer.templateNameField.infoLabel')}
            validateLabel={tDrawer(
              'updateEServiceTemplateNameDrawer.templateNameField.validation.sameValue'
            )}
          />
          <UpdateDescriptionDrawer
            isOpen={isEServiceTemplateUpdateDescriptionDrawerOpen}
            onClose={closeEServiceTemplateUpdateDescriptionDrawer}
            id={template.eserviceTemplate.id}
            description={template.eserviceTemplate.description}
            onSubmit={handleDescriptionUpdate}
            title={tDrawer('updateEServiceTemplateDescriptionDrawer.title')}
            subtitle={tDrawer('updateEServiceTemplateDescriptionDrawer.subtitle')}
            label={tDrawer(
              'updateEServiceTemplateDescriptionDrawer.templateDescriptionField.label'
            )}
            infoLabel={tDrawer(
              'updateEServiceTemplateDescriptionDrawer.templateDescriptionField.infoLabel'
            )}
            validateLabel={tDrawer(
              'updateEServiceTemplateDescriptionDrawer.templateDescriptionField.validation.sameValue'
            )}
          />
          <UpdateDescriptionDrawer
            isOpen={isEServiceTemplateUpdateAudienceDrawerOpen}
            onClose={closeEServiceUpdateAudienceDrawer}
            id={template.eserviceTemplate.id}
            description={template.eserviceTemplate.intendedTarget}
            onSubmit={handleIntendedTargetUpdate}
            title={tDrawer('updateEServiceTemplateAudienceDrawer.title')}
            subtitle={tDrawer('updateEServiceTemplateAudienceDrawer.subtitle')}
            label={tDrawer('updateEServiceTemplateAudienceDrawer.templateAudienceField.label')}
            infoLabel={tDrawer(
              'updateEServiceTemplateAudienceDrawer.templateAudienceField.infoLabel'
            )}
            validateLabel={tDrawer(
              'updateEServiceTemplateAudienceDrawer.templateAudienceField.validation.sameValue'
            )}
          />
        </>
      )}
    </>
  )
}

export const EServiceTemplateGeneralInfoSectionSkeleton = () => {
  return <SectionContainerSkeleton sx={{ mt: 4 }} height={383} />
}
