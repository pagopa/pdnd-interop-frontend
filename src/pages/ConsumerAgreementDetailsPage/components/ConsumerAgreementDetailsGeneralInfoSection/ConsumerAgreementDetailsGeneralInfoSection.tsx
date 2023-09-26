import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useConsumerAgreementDetailsContext } from '../ConsumerAgreementDetailsContext'
import { useDrawerState } from '@/hooks/useDrawerState'
import { Divider, Stack } from '@mui/material'
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
    keyPrefix: 'providerRead.sections.generalInformations',
  }) // TODO stringhe
  const { agreement } = useConsumerAgreementDetailsContext()
  const downloadContract = AgreementDownloads.useDownloadContract()

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

  if (!agreement) return <ConsumerAgreementDetailsGeneralInfoSectionSkeleton />

  const isEserviceMine = agreement.consumer.id === agreement.producer.id

  const handleOpenContactDrawer = () => {
    openContactDrawer()
  }

  const handleOpenCertifiedAttributesDrawer = () => {
    openCertifiedAttributeDrawer()
  }

  const handleDownloadDocument = () => {
    downloadContract({ agreementId: agreement.id }, `${t('TODO documentation.fileName')}.pdf`)
  }

  return (
    <>
      <SectionContainer title={'TODO Informazioni generali'} newDesign>
        <Stack spacing={2}>
          <InformationContainer
            label={'TODO Richiesta per l’e-service'}
            content={
              <Link
                to="SUBSCRIBE_CATALOG_VIEW"
                params={{
                  eserviceId: agreement.eservice.id,
                  descriptorId: agreement.descriptorId,
                }}
              >
                {t('TODO eServiceField.value', {
                  name: agreement.eservice.name,
                  version: agreement.eservice.version,
                })}
              </Link>
            }
          />
          <InformationContainer label={'TODO Erogatore'} content={agreement.producer.name} />
          {agreement.state === 'REJECTED' && agreement.rejectionReason && (
            <InformationContainer
              label={t('TODO rejectionMessageField.label')}
              direction="column"
              content={agreement.rejectionReason}
            />
          )}
          {!isEserviceMine && (
            <>
              <Divider />
              {agreement.isContractPresent && (
                <IconLink
                  onClick={handleDownloadDocument}
                  component="button"
                  startIcon={<DownloadIcon />}
                  alignSelf="start"
                >
                  {t('TODO documentation.link.label')}
                </IconLink>
              )}
              {agreement.state === 'PENDING' && (
                <>
                  <IconLink
                    onClick={handleOpenCertifiedAttributesDrawer}
                    component="button"
                    startIcon={<RuleIcon />}
                    alignSelf="start"
                  >
                    {t('TODO certifiedAttributeLink.label')}
                  </IconLink>
                </>
              )}
              {agreement.consumer.contactMail && (
                <IconLink
                  onClick={handleOpenContactDrawer}
                  component="button"
                  startIcon={<ContactMailIcon />}
                  alignSelf="start"
                >
                  {t('TODO consumerDetailsLink.label')}
                </IconLink>
              )}
            </>
          )}
        </Stack>
      </SectionContainer>
      {/* {agreement.consumer.contactMail && (
        <ConsumerAgreementDetailsContactDrawer
          isOpen={isContactDrawerOpen}
          onClose={closeContactDrawer}
          contact={agreement.consumer.contactMail}
        />
      )}
      TODO aspettare che facciano l'arricchimento della struttura dati */}
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
