import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { IconLink } from '@/components/shared/IconLink'
import { Link } from '@/router'
import { Divider, Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import ContactMailIcon from '@mui/icons-material/ContactMail'
import DownloadIcon from '@mui/icons-material/Download'
import { AgreementDownloads } from '@/api/agreement'
import RuleIcon from '@mui/icons-material/Rule'
import { useDrawerState } from '@/hooks/useDrawerState'
import { ProviderAgreementDetailsContactDrawer } from './ProviderAgreementDetailsContactDrawer'
import { ProviderAgreementDetailsAttributesDrawer } from './ProviderAgreementDetailsAttributesDrawer'
import { useProviderAgreementDetailsContext } from '../ProviderAgreementDetailsContext'

export const ProviderAgreementDetailsGeneralInfoSection: React.FC = () => {
  const { t } = useTranslation('agreement', {
    keyPrefix: 'providerRead.sections.generalInformations',
  })
  const { agreement } = useProviderAgreementDetailsContext()
  const downloadContract = AgreementDownloads.useDownloadContract()

  const {
    isOpen: isContactDrawerOpen,
    openDrawer: openContactDrawer,
    closeDrawer: closeContactDrawer,
  } = useDrawerState()

  const [attributesDrawerData, setAttributesDrawerData] = React.useState<{
    isOpen: boolean
    attributeType: 'certified' | 'declared'
  }>({
    isOpen: false,
    attributeType: 'certified',
  })

  if (!agreement) return <ProviderAgreementDetailsGeneralInfoSectionSkeleton />

  const handleOpenContactDrawer = () => {
    openContactDrawer()
  }

  const handleOpenAttributesDrawer = (type: 'certified' | 'declared') => {
    setAttributesDrawerData({
      isOpen: true,
      attributeType: type,
    })
  }

  const closeAttributesDrawer = () => {
    setAttributesDrawerData((prev) => {
      return { ...prev, isOpen: false }
    })
  }

  const handleDownloadDocument = () => {
    downloadContract({ agreementId: agreement.id }, `${t('documentation.fileName')}.pdf`)
  }

  return (
    <>
      <SectionContainer title={t('title')} newDesign>
        <Stack spacing={2}>
          <InformationContainer
            label={t('eServiceField.label')}
            content={
              <Link
                to="PROVIDE_ESERVICE_MANAGE"
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
            label={t('consumerField.label')}
            content={agreement.consumer.name}
          />
          {agreement.state === 'REJECTED' && agreement.rejectionReason && (
            <InformationContainer
              label={t('rejectionMessageField.label')}
              direction="column"
              content={agreement.rejectionReason}
            />
          )}
          <Divider />
          {agreement.isContractPresent && (
            <IconLink
              onClick={handleDownloadDocument}
              component="button"
              startIcon={<DownloadIcon />}
              alignSelf="start"
            >
              {t('documentation.link.label')}
            </IconLink>
          )}
          {agreement.state === 'PENDING' && (
            <>
              <IconLink
                onClick={handleOpenAttributesDrawer.bind(null, 'certified')}
                component="button"
                startIcon={<RuleIcon />}
                alignSelf="start"
              >
                {t('certifiedAttributeLink.label')}
              </IconLink>
              <IconLink
                onClick={handleOpenAttributesDrawer.bind(null, 'declared')}
                component="button"
                startIcon={<RuleIcon />}
                alignSelf="start"
              >
                {t('declaredAttributeLink.label')}
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
              {t('consumerDetailsLink.label')}
            </IconLink>
          )}
        </Stack>
      </SectionContainer>
      {agreement.consumer.contactMail && (
        <ProviderAgreementDetailsContactDrawer
          isOpen={isContactDrawerOpen}
          onClose={closeContactDrawer}
          contact={agreement.consumer.contactMail}
        />
      )}
      <ProviderAgreementDetailsAttributesDrawer
        isOpen={attributesDrawerData.isOpen}
        onClose={closeAttributesDrawer}
        attributeType={attributesDrawerData.attributeType}
      />
    </>
  )
}

export const ProviderAgreementDetailsGeneralInfoSectionSkeleton: React.FC = () => {
  return <SectionContainerSkeleton height={250} />
}
