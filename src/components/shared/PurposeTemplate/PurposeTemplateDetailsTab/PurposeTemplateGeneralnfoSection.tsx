import React from 'react'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { Divider, Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { useTranslation } from 'react-i18next'
import type { PurposeTemplateWithCompactCreator } from '@/api/api.generatedTypes'
import DownloadIcon from '@mui/icons-material/Download'
import { PurposeTemplateDownloads } from '@/api/purposeTemplate/purposeTemplate.downloads'
import EditIcon from '@mui/icons-material/Edit'
import { useDrawerState } from '@/hooks/useDrawerState'
import {
  UpdateMetadataDrawer,
  type UpdateMetadataFormValues,
} from '@/components/shared/UpdateMetadataDrawer'
import { PurposeTemplateMutations } from '@/api/purposeTemplate/purposeTemplate.mutations'
import { useCurrentRoute } from '@/router'
import { AuthHooks } from '@/api/auth'

type PurposeTemplateGeneralInfoSectionProps = {
  purposeTemplate: PurposeTemplateWithCompactCreator
}
export const PurposeTemplateGeneralInfoSection: React.FC<
  PurposeTemplateGeneralInfoSectionProps
> = ({ purposeTemplate }) => {
  const { t } = useTranslation('purposeTemplate', {
    keyPrefix: 'read.detailsTab.sections.generalInformation',
  })
  const { isOpen, openDrawer, closeDrawer } = useDrawerState()
  const { routeKey } = useCurrentRoute()
  const { isAdmin } = AuthHooks.useJwt()
  const isMetadataEditable = isAdmin && routeKey === 'SUBSCRIBE_PURPOSE_TEMPLATE_DETAILS'
  const { mutate: patchUpdatePurposeTemplate } =
    PurposeTemplateMutations.usePatchUpdatePurposeTemplate()

  const handleMetadataUpdate = (values: UpdateMetadataFormValues) => {
    patchUpdatePurposeTemplate(
      {
        purposeTemplateId: purposeTemplate.id,
        ...(values.name !== purposeTemplate.purposeTitle ? { purposeTitle: values.name } : {}),
        ...(values.description !== purposeTemplate.purposeDescription
          ? { purposeDescription: values.description }
          : {}),
        ...(values.target !== purposeTemplate.targetDescription
          ? { targetDescription: values.target }
          : {}),
      },
      { onSuccess: closeDrawer }
    )
  }

  const downloadSignedRiskAnalysis = PurposeTemplateDownloads.useDownloadSignedRiskAnalysis()

  const handleDownloadSignedDocument = () => {
    downloadSignedRiskAnalysis(
      {
        purposeTemplateId: purposeTemplate.id,
      },
      `${t('riskAnalysis.fileName')}.pdf`
    )
  }

  const downloadRiskAnalysisAction = {
    startIcon: <DownloadIcon fontSize="small" sx={{ mr: 1 }} />,
    component: 'button',
    onClick: handleDownloadSignedDocument,
    label: t('riskAnalysis.link.label'),
    sx: { fontWeight: 700 },
  }

  const tenantKindTranslationKey =
    purposeTemplate.targetTenantKind === 'PA'
      ? t('tenantKindValues.labelPA')
      : t('tenantKindValues.labelNotPA')

  return (
    <>
      <SectionContainer title={t('title')} bottomActions={[downloadRiskAnalysisAction]}>
        <Stack spacing={2}>
          <SectionContainer
            innerSection
            title={t('nameAndDescription.title')}
            titleTypographyProps={{ variant: 'body1', fontWeight: 600 }}
            topSideActions={
              isMetadataEditable
                ? [
                    {
                      action: openDrawer,
                      label: t('nameAndDescription.edit'),
                      icon: EditIcon,
                    },
                  ]
                : undefined
            }
          >
            <Stack spacing={2}>
              <InformationContainer
                label={t('nameAndDescription.nameField.label')}
                content={purposeTemplate.purposeTitle}
              />
              <InformationContainer
                label={t('nameAndDescription.descriptionField.label')}
                direction="column"
                content={purposeTemplate.purposeDescription}
              />
              <InformationContainer
                label={t('nameAndDescription.targetField.label')}
                direction="column"
                content={purposeTemplate.targetDescription}
              />
            </Stack>
          </SectionContainer>
          <Divider />
          <SectionContainer
            innerSection
            title={t('specifications.title')}
            titleTypographyProps={{ variant: 'body1', fontWeight: 600 }}
          >
            <Stack spacing={2}>
              <InformationContainer
                label={t('producerName')}
                content={purposeTemplate.creator.name}
              />
              <InformationContainer label={t('tenantKind')} content={tenantKindTranslationKey} />
              <InformationContainer
                label={t('handlesPersonalDataLabel')}
                content={purposeTemplate.handlesPersonalData ? t('yes') : t('no')}
              />
            </Stack>
          </SectionContainer>
        </Stack>
      </SectionContainer>
      {isMetadataEditable && (
        <UpdateMetadataDrawer
          isOpen={isOpen}
          onClose={closeDrawer}
          title={t('updateMetadataDrawer.title')}
          description={t('updateMetadataDrawer.description')}
          nameField={{
            label: t('updateMetadataDrawer.nameField.label'),
            helperText: t('updateMetadataDrawer.nameField.helperText'),
            validation: {
              required: true,
              minLength: 5,
              maxLength: 60,
            },
          }}
          descriptionField={{
            label: t('updateMetadataDrawer.descriptionField.label'),
            helperText: t('updateMetadataDrawer.descriptionField.helperText'),
            validation: {
              required: true,
              minLength: 10,
              maxLength: 250,
            },
          }}
          targetField={{
            label: t('updateMetadataDrawer.targetField.label'),
            helperText: t('updateMetadataDrawer.targetField.helperText'),
            validation: {
              required: true,
              minLength: 10,
              maxLength: 250,
            },
          }}
          initialValues={{
            name: purposeTemplate.purposeTitle,
            description: purposeTemplate.purposeDescription,
            target: purposeTemplate.targetDescription,
          }}
          onSubmit={handleMetadataUpdate}
        />
      )}
    </>
  )
}

export const PurposeTemplateGeneralInfoSectionSkeleton = () => {
  return <SectionContainerSkeleton sx={{ mt: 4 }} height={383} />
}
