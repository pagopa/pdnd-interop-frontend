import type { Purpose } from '@/api/api.generatedTypes'
import { SectionContainer } from '@/components/layout/containers'
import { Link, useGeneratePath } from '@/router'
import { Divider, Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import React from 'react'
import LinkIcon from '@mui/icons-material/Link'
import { useTranslation } from 'react-i18next'
import EditIcon from '@mui/icons-material/Edit'
import { useDrawerState } from '@/hooks/useDrawerState'
import { UpdateMetadataDrawer } from '@/components/shared/UpdateMetadataDrawer'
import { PurposeDownloads } from '@/api/purpose'
import DownloadIcon from '@mui/icons-material/Download'
import { AuthHooks } from '@/api/auth'

type ConsumerPurposeDetailsGeneralInfoSectionProps = {
  purpose: Purpose
}

export const ConsumerPurposeDetailsGeneralInfoSection: React.FC<
  ConsumerPurposeDetailsGeneralInfoSectionProps
> = ({ purpose }) => {
  const { t: tShared } = useTranslation('shared-components', { keyPrefix: 'documents' })
  const { t } = useTranslation('purpose', {
    keyPrefix: 'consumerView.sections.generalInformations',
  })

  const { isAdmin } = AuthHooks.useJwt()
  const generatePath = useGeneratePath()
  const { isOpen, openDrawer, closeDrawer } = useDrawerState()

  const downloadSignedRiskAnalysis = PurposeDownloads.useDownloadSignedRiskAnalysis()

  const handleDownloadSignedDocument = () => {
    if (!purpose.currentVersion || !purpose.currentVersion.signedContract) return
    downloadSignedRiskAnalysis(
      {
        purposeId: purpose.id,
        versionId: purpose.currentVersion.id,
        signedContractId: purpose.currentVersion.signedContract?.id,
      },
      `${t('riskAnalysis.fileName')}.pdf`
    )
  }

  const downloadRiskAnalysisDocumentAction = {
    startIcon: <DownloadIcon fontSize="small" />,
    label: t('riskAnalysis.link.label'),
    component: 'button',
    type: 'button',
    sx: { fontWeight: '700' },
    disabled: purpose.isDocumentReady === false,
    tooltip: purpose.isDocumentReady === false ? tShared('notAvailableYet') : undefined,
    onClick: handleDownloadSignedDocument,
    'data-testid': 'download-risk-analysis-document-button',
  }

  const isFromPurposeTemplate = Boolean(purpose.purposeTemplate?.id)

  return (
    <SectionContainer
      title={t('title')}
      bottomActions={[
        ...(!purpose.currentVersion || !purpose.currentVersion.riskAnalysisDocument
          ? []
          : [downloadRiskAnalysisDocumentAction]),
        {
          startIcon: <LinkIcon fontSize="small" />,
          label: t('agreementLink.label'),
          sx: { fontWeight: '700' },
          href:
            '/ui' + generatePath('SUBSCRIBE_AGREEMENT_READ', { agreementId: purpose.agreement.id }),
          target: '_blank',
        },
      ]}
    >
      <Stack spacing={2}>
        <SectionContainer
          innerSection
          title={t('nameAndDescription.title')}
          titleTypographyProps={{ variant: 'body1', fontWeight: 600 }}
          topSideActions={
            isAdmin
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
              content={purpose.title}
            />
            <InformationContainer
              label={t('nameAndDescription.descriptionField.label')}
              content={purpose.description}
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
              label={t('specifications.eServiceField.label')}
              content={
                <Link
                  to="SUBSCRIBE_CATALOG_VIEW"
                  params={{
                    eserviceId: purpose.eservice.id,
                    descriptorId: purpose.eservice.descriptor.id,
                  }}
                >
                  {t('specifications.eServiceField.value', {
                    name: purpose.eservice.name,
                    version: purpose.eservice.descriptor.version,
                  })}
                </Link>
              }
            />
            <InformationContainer
              label={t('specifications.providerField.label')}
              content={purpose.eservice.producer.name}
            />
            {purpose.delegation && (
              <>
                <InformationContainer
                  label={t('consumerField.label')}
                  content={purpose.consumer.name}
                />
                <InformationContainer
                  label={t('delegatedConsumerField.label')}
                  content={purpose.delegation.delegate.name}
                />
              </>
            )}
            {isFromPurposeTemplate && (
              <InformationContainer
                label={t('specifications.purposeTemplateField.label')}
                content={
                  <Link
                    to="SUBSCRIBE_PURPOSE_TEMPLATE_CATALOG_DETAILS"
                    params={{
                      purposeTemplateId: purpose.purposeTemplate?.id as string,
                    }}
                  >
                    {purpose.purposeTemplate?.purposeTitle as string}
                  </Link>
                }
              />
            )}
          </Stack>
        </SectionContainer>
      </Stack>
      <UpdateMetadataDrawer
        isOpen={isOpen}
        onClose={closeDrawer}
        title={t('updateMetadataDrawer.title')}
        description={t('updateMetadataDrawer.description')}
        nameField={{
          label: t('updateMetadataDrawer.nameField.label'),
          helperText: t('updateMetadataDrawer.nameField.helperText'),
        }}
        descriptionField={{
          label: t('updateMetadataDrawer.descriptionField.label'),
          helperText: t('updateMetadataDrawer.descriptionField.helperText'),
        }}
        initialValues={{ name: purpose.title, description: purpose.description }}
        onSubmit={() => null} /* TODO: Implement update metadata functionality */
      />
    </SectionContainer>
  )
}
