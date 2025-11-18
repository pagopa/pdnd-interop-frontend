import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useConsumerAgreementDetailsContext } from '../ConsumerAgreementDetailsContext'
import { useDrawerState } from '@/hooks/useDrawerState'
import { Button, Divider, Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { Link } from '@/router'
import { IconLink } from '@/components/shared/IconLink'
import ContactMailIcon from '@mui/icons-material/ContactMail'
import DownloadIcon from '@mui/icons-material/Download'
import RuleIcon from '@mui/icons-material/Rule'
import { AgreementDownloads } from '@/api/agreement'
import { ConsumerAgreementDetailsContactDrawer } from './ConsumerAgreementDetailsContactDrawer'
import { ConsumerAgreementDetailsCertifiedAttributesDrawer } from './ConsumerAgreementDetailsCertifiedAttributesDrawer'

export const ConsumerAgreementDetailsGeneralInfoSection: React.FC = () => {
  const { t } = useTranslation('agreement', {
    keyPrefix: 'consumerRead.sections.generalInformations',
  })
  const { agreement } = useConsumerAgreementDetailsContext()
  const downloadContract = AgreementDownloads.useDownloadContract()
  const downloadSignedAgreementDocument = AgreementDownloads.useDownloadSignedContract()

  const isDelegated = Boolean(agreement.delegation)

  const {
    isOpen: isContactDrawerOpen,
    openDrawer: openContactDrawer,
    closeDrawer: closeContactDrawer,
  } = useDrawerState()

  const {
    isOpen: isCertifiedAttributeDrawerOpen,
    openDrawer: openCertifiedAttributeDrawer,
    closeDrawer: closeCertifiedAttributeDrawer,
  } = useDrawerState()

  const handleOpenContactDrawer = () => {
    openContactDrawer()
  }

  const handleOpenCertifiedAttributesDrawer = () => {
    openCertifiedAttributeDrawer()
  }

  const handleDownloadDocument = () => {
    downloadContract({ agreementId: agreement.id }, `${t('documentation.fileName')}.pdf`)
  }

  const handleDownloadSignedAgreementDocument = () => {
    downloadSignedAgreementDocument(
      { agreementId: agreement.id },
      `${t('documentation.fileName')}.pdf`
    )
  }

  return (
    <>
      <SectionContainer title={t('title')}>
        <Stack spacing={2}>
          <InformationContainer
            label={t('eServiceField.label')}
            content={
              <Link
                to="SUBSCRIBE_CATALOG_VIEW"
                params={{
                  eserviceId: agreement.eservice.id,
                  descriptorId: agreement.descriptorId,
                }}
              >
                {t('eServiceField.value', {
                  name: agreement.eservice.name,
                  version: agreement.eservice.version,
                })}
              </Link>
            }
          />
          <InformationContainer
            label={t('providerField.label')}
            content={agreement.producer.name}
          />
          <InformationContainer
            label={t('consumerField.label')}
            content={agreement.consumer.name}
          />
          {isDelegated && (
            <InformationContainer
              label={t('delegatedConsumerField.label')}
              content={agreement.delegation?.delegate.name as string}
            />
          )}
          {agreement.state === 'REJECTED' && agreement.rejectionReason && (
            <InformationContainer
              label={t('rejectionMessageField.label')}
              direction="column"
              content={agreement.rejectionReason}
            />
          )}
          <>
            <Divider />
            {agreement.isContractPresent && (
              <>
                <Button
                  disabled={!agreement.isDocumentReady}
                  onClick={handleDownloadSignedAgreementDocument}
                  startIcon={<DownloadIcon />}
                  sx={{ alignSelf: 'start', paddingX: 1 }}
                >
                  {t('documentation.link.label')}
                </Button>
              </>
            )}
            {agreement.state === 'PENDING' && (
              <>
                <Button
                  onClick={handleOpenCertifiedAttributesDrawer}
                  component="button"
                  startIcon={<RuleIcon />}
                  style={{ alignSelf: 'start', marginTop: 0 }}
                  sx={{ paddingX: 1, marginTop: 0 }}
                >
                  {t('certifiedAttributeLink.label')}
                </Button>
              </>
            )}
            {agreement.producer.contactMail && (
              <IconLink
                onClick={handleOpenContactDrawer}
                component="button"
                startIcon={<ContactMailIcon />}
                alignSelf="start"
              >
                {t('providerDetailsLink.label')}
              </IconLink>
            )}
          </>
        </Stack>
      </SectionContainer>
      {agreement.producer.contactMail && (
        <ConsumerAgreementDetailsContactDrawer
          isOpen={isContactDrawerOpen}
          onClose={closeContactDrawer}
          contact={agreement.producer.contactMail}
        />
      )}
      <ConsumerAgreementDetailsCertifiedAttributesDrawer
        isOpen={isCertifiedAttributeDrawerOpen}
        onClose={closeCertifiedAttributeDrawer}
      />
    </>
  )
}

export const ConsumerAgreementDetailsGeneralInfoSectionSkeleton: React.FC = () => {
  return <SectionContainerSkeleton height={250} />
}
