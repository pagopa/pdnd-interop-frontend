import React from 'react'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { Alert, Button, Divider, Link, Stack, Typography } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { Trans, useTranslation } from 'react-i18next'
import { useParams } from '@/router'
import { useQuery } from '@tanstack/react-query'
import { EServiceTemplateMutations, EServiceTemplateQueries } from '@/api/eserviceTemplate'
import FileCopyIcon from '@mui/icons-material/FileCopy'
import EditIcon from '@mui/icons-material/Edit'
import { useDrawerState } from '@/hooks/useDrawerState'
import { EServiceTemplateVersionSelectorDrawer } from '@/components/shared/EserviceTemplate'
import { UpdatePersonalDataDrawer } from '../UpdatePersonalDataDrawer'
import {
  ESERVICE_DESCRIPTION_MAX_LENGTH,
  ESERVICE_TEMPLATE_NAME_MAX_LENGTH,
  eserviceNamingBestPracticeLink,
} from '@/config/constants'
import { AuthHooks } from '@/api/auth'
import { UpdateMetadataDrawer } from '@/components/shared/UpdateMetadataDrawer'

type EServiceTemplateGeneralInfoSectionProps = {
  readonly: boolean
  routeKey: 'SUBSCRIBE_ESERVICE_TEMPLATE_DETAILS' | 'PROVIDE_ESERVICE_TEMPLATE_DETAILS'
}
export const EServiceTemplateGeneralInfoSection: React.FC<
  EServiceTemplateGeneralInfoSectionProps
> = ({ routeKey, readonly }) => {
  const isProviderDetails = routeKey === 'PROVIDE_ESERVICE_TEMPLATE_DETAILS'
  const { t } = useTranslation('eserviceTemplate', {
    keyPrefix: 'read.sections.generalInformations',
  })
  const { t: tCommon } = useTranslation('common')

  const { isAdmin, isOperatorAPI } = AuthHooks.useJwt()

  const { eServiceTemplateId, eServiceTemplateVersionId } = useParams<typeof routeKey>()
  const { data: eserviceTemplateVersion } = useQuery(
    EServiceTemplateQueries.getSingle(eServiceTemplateId, eServiceTemplateVersionId)
  )

  const isMetadataEditable = isProviderDetails && !readonly && Boolean(eserviceTemplateVersion)

  const { mutate: updateEserviceTemplatePersonalData } =
    EServiceTemplateMutations.useUpdateEServiceTemplatePersonalDataFlagAfterPublication()

  const {
    isOpen: isVersionSelectorDrawerOpen,
    openDrawer: openVersionSelectorDrawer,
    closeDrawer: closeVersionSelectorDrawer,
  } = useDrawerState()

  const {
    isOpen: isMetadataDrawerOpen,
    openDrawer: openMetadataDrawer,
    closeDrawer: closeMetadataDrawer,
  } = useDrawerState()

  const hasSingleVersion =
    eserviceTemplateVersion && eserviceTemplateVersion.eserviceTemplate.versions.length <= 1

  const navigateTemplateVersionsAction = {
    startIcon: <FileCopyIcon fontSize="small" />,
    component: 'button',
    onClick: openVersionSelectorDrawer,
    label: t('bottomActions.navigateTemplateVersions'),
  }

  const {
    isOpen: isEServiceUpdatePersonalDataDrawerOpen,
    openDrawer: openUpdatePersonalDataDrawer,
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
        title={t('generalInformationTitle')}
        bottomActions={[
          ...(!hasSingleVersion ? [navigateTemplateVersionsAction] : []),
          //TODO: THE API is not ready yet
        ]}
      >
        <Stack spacing={2}>
          <InformationContainer
            label={t('version.label')}
            content={eserviceTemplateVersion?.version.toString() || '1'}
          />
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
          {(isAdmin || isOperatorAPI) &&
            routeKey === 'PROVIDE_ESERVICE_TEMPLATE_DETAILS' &&
            eserviceTemplateVersion?.eserviceTemplate.personalData === undefined && (
              <Alert severity="warning" sx={{ alignItems: 'center' }} variant="outlined">
                <Stack spacing={17} direction="row" alignItems="center">
                  {' '}
                  {/**TODO FIX SPACING */}
                  <Typography>{t('personalDataField.alert.label')}</Typography>
                  <Button
                    variant="naked"
                    size="medium"
                    sx={{ fontWeight: 700, mr: 1 }}
                    onClick={openUpdatePersonalDataDrawer}
                  >
                    {tCommon('actions.specifyProcessing')}
                  </Button>
                </Stack>
              </Alert>
            )}
          <Divider />
          <SectionContainer
            innerSection
            title={t('nameAndDescription.title')}
            titleTypographyProps={{ variant: 'body1', fontWeight: 600 }}
            topSideActions={
              isMetadataEditable
                ? [
                    {
                      action: openMetadataDrawer,
                      label: tCommon('actions.edit'),
                      icon: EditIcon,
                    },
                  ]
                : undefined
            }
          >
            <Stack spacing={2}>
              <InformationContainer
                label={t('nameAndDescription.nameField.label')}
                content={eserviceTemplateVersion?.eserviceTemplate.name ?? ''}
              />
              <InformationContainer
                label={t('nameAndDescription.descriptionField.label')}
                content={eserviceTemplateVersion?.eserviceTemplate.description ?? ''}
              />
              <InformationContainer
                label={t('nameAndDescription.targetField.label')}
                content={eserviceTemplateVersion?.eserviceTemplate.intendedTarget ?? ''}
              />
            </Stack>
          </SectionContainer>
          <Divider />
          <SectionContainer
            innerSection
            title={t('versionSection.title')}
            titleTypographyProps={{ variant: 'body1', fontWeight: 600 }}
          >
            <InformationContainer
              label={t('versionDescription.label')}
              content={eserviceTemplateVersion?.description ?? ''}
            />
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
              {isMetadataEditable && (
                <UpdateMetadataDrawer
                  isOpen={isMetadataDrawerOpen}
                  onClose={closeMetadataDrawer}
                  title={t('updateMetadataDrawer.title')}
                  description={
                    <Typography variant="body2">
                      <Trans
                        components={{
                          1: <Link href={eserviceNamingBestPracticeLink} target="_blank" />,
                        }}
                      >
                        {t('updateMetadataDrawer.description')}
                      </Trans>
                    </Typography>
                  }
                  nameField={{
                    label: t('updateMetadataDrawer.nameField.label'),
                    helperText: t('updateMetadataDrawer.nameField.helperText', {
                      maxLength: ESERVICE_TEMPLATE_NAME_MAX_LENGTH,
                    }),
                    validation: {
                      required: true,
                      minLength: 5,
                      maxLength: ESERVICE_TEMPLATE_NAME_MAX_LENGTH,
                    },
                  }}
                  descriptionField={{
                    label: t('updateMetadataDrawer.descriptionField.label'),
                    helperText: t('updateMetadataDrawer.descriptionField.helperText', {
                      maxLength: ESERVICE_DESCRIPTION_MAX_LENGTH,
                    }),
                    validation: {
                      required: true,
                      minLength: 10,
                      maxLength: ESERVICE_DESCRIPTION_MAX_LENGTH,
                    },
                  }}
                  targetField={{
                    label: t('updateMetadataDrawer.targetField.label'),
                    helperText: t('updateMetadataDrawer.targetField.helperText'),
                    validation: { required: true, minLength: 10, maxLength: 250 },
                  }}
                  initialValues={{
                    name: eserviceTemplateVersion.eserviceTemplate.name,
                    description: eserviceTemplateVersion.eserviceTemplate.description,
                    target: eserviceTemplateVersion.eserviceTemplate.intendedTarget,
                  }}
                  onSubmit={() => null} /* TODO: Implement e-service template metadata update */
                />
              )}
              <UpdatePersonalDataDrawer
                isOpen={isEServiceUpdatePersonalDataDrawerOpen}
                onClose={closeEServiceUpdatePersonalDataDrawer}
                eserviceId={eserviceTemplateVersion.eserviceTemplate.id}
                personalData={eserviceTemplateVersion.eserviceTemplate.personalData}
                onSubmit={handleEServiceTemplatePersonalDataUpdate}
                eserviceMode={eserviceTemplateVersion.eserviceTemplate.mode}
                where="template e-service"
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
