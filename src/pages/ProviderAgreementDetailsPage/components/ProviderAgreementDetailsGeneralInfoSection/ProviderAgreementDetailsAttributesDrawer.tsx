import { Drawer } from '@/components/shared/Drawer'
import React from 'react'
import { ProviderAgreementDetailsAttributesDrawerCertifiedAttributesSection } from './ProviderAgreementDetailsAttributesDrawerCertifiedAttributesSection'
import { ProviderAgreementDetailsAttributesDrawerDeclaredAttributesSection } from './ProviderAgreementDetailsAttributesDrawerDeclaredAttributesSection'
import { Trans, useTranslation } from 'react-i18next'
import { Link } from '@mui/material'
import { attributesHelpLink } from '@/config/constants'

type ProviderAgreementDetailsAttributesDrawerProps = {
  isOpen: boolean
  onClose: VoidFunction
  attributeType: 'certified' | 'declared'
}

export const ProviderAgreementDetailsAttributesDrawer: React.FC<
  ProviderAgreementDetailsAttributesDrawerProps
> = ({ isOpen, onClose, attributeType }) => {
  const { t } = useTranslation('agreement', {
    keyPrefix: 'providerRead.sections.generalInformations.attributesDrawer',
  })

  const subtitle =
    attributeType === 'certified' ? (
      <Trans
        components={{ 1: <Link underline="hover" href={attributesHelpLink} target="_blank" /> }}
      >
        {t('subtitle.certified')}
      </Trans>
    ) : undefined

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={t(`title.${attributeType}`)}
      subtitle={subtitle}
    >
      {attributeType === 'certified' && (
        <ProviderAgreementDetailsAttributesDrawerCertifiedAttributesSection />
      )}
      {attributeType === 'declared' && (
        <ProviderAgreementDetailsAttributesDrawerDeclaredAttributesSection />
      )}
    </Drawer>
  )
}
