import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { TOSAgreement as PagoPATOSAgreement } from '@pagopa/mui-italia'
import { Link } from '@/router'

type TOSAgreementProps = {
  onAcceptAgreement: VoidFunction
}

const TOSAgreement: React.FC<TOSAgreementProps> = ({ onAcceptAgreement }) => {
  const { t } = useTranslation('pagopa', { keyPrefix: 'tos' })

  return (
    <PagoPATOSAgreement
      sx={{ height: '100%' }}
      productName={t('title')}
      description={
        <Trans components={{ 1: <Link to="TOS" underline="hover" /> }}>{t('description')}</Trans>
      }
      onConfirm={onAcceptAgreement}
      confirmBtnLabel={t('confirmBtnLabel')}
    />
  )
}

export default TOSAgreement
