import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { Link } from '@/router'
import { Stack } from '@mui/material'
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

  const actions = []

  if (agreement.isContractPresent) {
    actions.push({
      startIcon: <DownloadIcon fontSize="small" />,
      label: t('documentation.link.label'),
      component: 'button',
      type: 'button',
      onClick: handleDownloadDocument,
    })
  }

  if (agreement.state === 'PENDING') {
    actions.push(
      {
        startIcon: <RuleIcon fontSize="small" />,
        label: t('certifiedAttributeLink.label'),
        component: 'button',
        type: 'button',
        onClick: handleOpenAttributesDrawer.bind(null, 'certified'),
      },
      {
        startIcon: <RuleIcon fontSize="small" />,
        label: t('declaredAttributeLink.label'),
        component: 'button',
        type: 'button',
        onClick: handleOpenAttributesDrawer.bind(null, 'declared'),
      }
    )
  }

  if (agreement.consumer.contactMail) {
    actions.push({
      startIcon: <ContactMailIcon fontSize="small" />,
      label: t('consumerDetailsLink.label'),
      component: 'button',
      type: 'button',
      onClick: handleOpenContactDrawer,
    })
  }

  return (
    <>
      <SectionContainer title={t('title')} bottomActions={actions}>
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
