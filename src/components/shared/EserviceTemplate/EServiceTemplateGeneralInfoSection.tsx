import React from 'react'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { Alert, Button, Divider, Stack, Typography } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { useTranslation } from 'react-i18next'
import { useParams } from '@/router'
import { useQuery } from '@tanstack/react-query'
import { EServiceTemplateMutations, EServiceTemplateQueries } from '@/api/eserviceTemplate'
import FileCopyIcon from '@mui/icons-material/FileCopy'
import DownloadIcon from '@mui/icons-material/Download'
import EditIcon from '@mui/icons-material/Edit'
import { useDrawerState } from '@/hooks/useDrawerState'
import { UpdateDescriptionDrawer } from '@/components/shared/UpdateDescriptionDrawer'
import { UpdateNameDrawer } from '@/components/shared/UpdateNameDrawer'
import { EServiceTemplateDownloads } from '@/api/eserviceTemplate/eserviceTemplate.downloads'
import { EServiceTemplateVersionSelectorDrawer } from '@/components/shared/EserviceTemplate'
import { UpdateEServicePersonalDataDrawer } from '../UpdateEServicePersonalDataDrawer'
import { FEATURE_FLAG_ESERVICE_PERSONAL_DATA } from '@/config/env'

type EServiceTemplateGeneralInfoSectionProps = {
  readonly: boolean
  routeKey: 'SUBSCRIBE_ESERVICE_TEMPLATE_DETAILS' | 'PROVIDE_ESERVICE_TEMPLATE_DETAILS'
}
export const EServiceTemplateGeneralInfoSection: React.FC<
  EServiceTemplateGeneralInfoSectionProps
> = ({ routeKey, readonly }) => {
  routeKey
  const { t } = useTranslation('eserviceTemplate', {
    keyPrefix: 'read.sections.generalInformations',
  })
  const { t: tDrawer } = useTranslation('eserviceTemplate', {
    keyPrefix: 'read.drawers',
  })
  const { t: tCommon } = useTranslation('common')

  const { eServiceTemplateId, eServiceTemplateVersionId } = useParams<typeof routeKey>()
  const { data: eserviceTemplateVersion } = useQuery(
    EServiceTemplateQueries.getSingle(eServiceTemplateId, eServiceTemplateVersionId)
  )

  const downloadTemplateConsumerList =
    EServiceTemplateDownloads.useDownloadEServiceTemplateConsumerList()

  const { mutate: updateEserviceTemplateDescription } =
    EServiceTemplateMutations.useUpdateEServiceTemplateDescription()

  const { mutate: updateEserviceTemplateIntendedTarget } =
    EServiceTemplateMutations.useUpdateEServiceTemplateIntendedTarget()

  const { mutate: updateEserviceTemplateName } =
    EServiceTemplateMutations.useUpdateEServiceTemplateName()

  const { mutate: updateEserviceTemplatePersonalData } =
    EServiceTemplateMutations.useUpdateEServiceTemplatePersonalDataFlagAfterPublication()

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
        eserviceTemplateName: eserviceTemplateVersion?.eserviceTemplate.name,
      })
    )
  }

  const hasSingleVersion =
    eserviceTemplateVersion && eserviceTemplateVersion.eserviceTemplate.versions.length <= 1

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

  const {
    isOpen: isEServiceUpdatePersonalDataDrawerOpen,
    openDrawer: openUpdateEServicePersonalDataDrawer,
    closeDrawer: closeEServiceUpdatePersonalDataDrawer,
  } = useDrawerState()

  const handleEServiceTemplatePersonalDataUpdate = (
    eserviceTemplateId: string,
    personalData: boolean
  ) => {
    updateEserviceTemplatePersonalData(
      {
        eserviceTemplateId: eserviceTemplateId,
        personalData: personalData,
      },
      { onSuccess: closeEServiceUpdatePersonalDataDrawer }
    )
  }

  return (
    <>
      <SectionContainer
        title={t('title')}
        bottomActions={[
          ...(!hasSingleVersion ? [navigateTemplateVersionsAction] : []),
          //TODO: THE API is not ready yet
          // downloadUsingTenantsListAction,
        ]}
      >
        <Stack spacing={2}>
          <InformationContainer
            label={t('version.label')}
            content={eserviceTemplateVersion?.version.toString() || '1'}
          />
          {FEATURE_FLAG_ESERVICE_PERSONAL_DATA === 'true' && (
            <InformationContainer
              label={
                eserviceTemplateVersion
                  ? t(`personalDataField.${eserviceTemplateVersion?.eserviceTemplate.mode}.label`)
                  : ''
              }
              content={t(
                `personalDataField.value.${eserviceTemplateVersion?.eserviceTemplate.personalData}`
              )}
            />
          )}
          {FEATURE_FLAG_ESERVICE_PERSONAL_DATA === 'true' &&
            routeKey === 'PROVIDE_ESERVICE_TEMPLATE_DETAILS' &&
            eserviceTemplateVersion?.eserviceTemplate.personalData === undefined && (
              <Alert severity="warning" sx={{ alignItems: 'center' }}>
                <Stack spacing={17} direction="row" alignItems="center">
                  {' '}
                  {/**TODO FIX SPACING */}
                  <Typography>{t('personalDataField.alert.label')}</Typography>
                  <Button
                    variant="naked"
                    size="medium"
                    sx={{ fontWeight: 700, mr: 1 }}
                    onClick={openUpdateEServicePersonalDataDrawer}
                  >
                    {tCommon('actions.specifyProcessing')}
                  </Button>
                </Stack>
              </Alert>
            )}
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
            <Typography variant="body2">
              {eserviceTemplateVersion?.eserviceTemplate.name}
            </Typography>
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
            <Typography variant="body2">
              {eserviceTemplateVersion?.eserviceTemplate.intendedTarget}
            </Typography>
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
            <Typography variant="body2">
              {eserviceTemplateVersion?.eserviceTemplate.description}
            </Typography>
          </SectionContainer>
          <Divider />
          <SectionContainer
            innerSection
            title={t('versionDescription.label')}
            titleTypographyProps={{ variant: 'body1', fontWeight: 600 }}
          >
            <Typography variant="body2">{eserviceTemplateVersion?.description ?? ''}</Typography>
          </SectionContainer>
        </Stack>
      </SectionContainer>
      <>
        {eserviceTemplateVersion && (
          <EServiceTemplateVersionSelectorDrawer
            isOpen={isVersionSelectorDrawerOpen}
            onClose={closeVersionSelectorDrawer}
            actualVersion={eserviceTemplateVersion.version.toString()}
            versions={eserviceTemplateVersion?.eserviceTemplate.versions ?? []}
            eServiceTemplateId={eserviceTemplateVersion.eserviceTemplate.id}
          />
        )}
        <>
          {eserviceTemplateVersion && !readonly && (
            <>
              <UpdateNameDrawer
                isOpen={isEServiceTemplateUpdateNameDrawerOpen}
                onClose={closeEServiceUpdateNameDrawer}
                id={eserviceTemplateVersion.eserviceTemplate.id}
                name={eserviceTemplateVersion.eserviceTemplate.name}
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
                id={eserviceTemplateVersion.eserviceTemplate.id}
                description={eserviceTemplateVersion.eserviceTemplate.description}
                onSubmit={handleDescriptionUpdate}
                title={tDrawer('updateEServiceTemplateDescriptionDrawer.title')}
                subtitle={tDrawer('updateEServiceTemplateDescriptionDrawer.subtitle')}
                label={tDrawer(
                  'updateEServiceTemplateDescriptionDrawer.eserviceTemplateDescriptionField.label'
                )}
                infoLabel={tDrawer(
                  'updateEServiceTemplateDescriptionDrawer.eserviceTemplateDescriptionField.infoLabel'
                )}
                validateLabel={tDrawer(
                  'updateEServiceTemplateDescriptionDrawer.eserviceTemplateDescriptionField.validation.sameValue'
                )}
              />
              <UpdateDescriptionDrawer
                isOpen={isEServiceTemplateUpdateAudienceDrawerOpen}
                onClose={closeEServiceUpdateAudienceDrawer}
                id={eserviceTemplateVersion.eserviceTemplate.id}
                description={eserviceTemplateVersion.eserviceTemplate.intendedTarget}
                onSubmit={handleIntendedTargetUpdate}
                title={tDrawer('updateEServiceTemplateAudienceDrawer.title')}
                subtitle={tDrawer('updateEServiceTemplateAudienceDrawer.subtitle')}
                label={tDrawer(
                  'updateEServiceTemplateAudienceDrawer.eserviceTemplateAudienceField.label'
                )}
                infoLabel={tDrawer(
                  'updateEServiceTemplateAudienceDrawer.eserviceTemplateAudienceField.infoLabel'
                )}
                validateLabel={tDrawer(
                  'updateEServiceTemplateAudienceDrawer.eserviceTemplateAudienceField.validation.sameValue'
                )}
              />
              <UpdateEServicePersonalDataDrawer
                isOpen={isEServiceUpdatePersonalDataDrawerOpen}
                onClose={closeEServiceUpdatePersonalDataDrawer}
                eserviceId={eserviceTemplateVersion.eserviceTemplate.id}
                personalData={eserviceTemplateVersion.eserviceTemplate.personalData}
                onSubmit={handleEServiceTemplatePersonalDataUpdate}
                eserviceMode={eserviceTemplateVersion.eserviceTemplate.mode}
              />
            </>
          )}
        </>
      </>
    </>
  )
}

export const EServiceTemplateGeneralInfoSectionSkeleton = () => {
  return <SectionContainerSkeleton sx={{ mt: 4 }} height={383} />
}
