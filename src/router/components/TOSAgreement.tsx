import { Typography } from '@mui/material'
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import RouterLink from './RouterLink'
import { TOSAgreement as PagoPATOSAgreement } from '@pagopa/mui-italia'

type TOSAgreementProps = {
  onAcceptAgreement: VoidFunction
}

const TOSAgreement: React.FC<TOSAgreementProps> = ({ onAcceptAgreement }) => {
  const { t } = useTranslation('pagopa', { keyPrefix: 'tos', useSuspense: false })

  return (
    <PagoPATOSAgreement
      productName={t('title')}
      description={t('description')}
      onConfirm={onAcceptAgreement}
      sx={{ backgroundColor: '#FAFAFA', flex: 1 }}
    >
      <Typography sx={{ px: 8, textAlign: 'center' }} color="text.secondary">
        <Trans components={{ 1: <RouterLink to="TOS" underline="hover" /> }}>
          {t('termsDescription')}
        </Trans>
      </Typography>
    </PagoPATOSAgreement>
  )
}

export default TOSAgreement
