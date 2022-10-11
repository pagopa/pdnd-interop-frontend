import React from 'react'
import { StyledTOSAgreementLayout } from '../components/Shared/StyledTOSAgreementLayout'
import { Trans, useTranslation } from 'react-i18next'
import { StyledLink } from '../components/Shared/StyledLink'
import { useRoute } from '../hooks/useRoute'
import { Typography } from '@mui/material'
import { LIGHT_GRAY } from '../lib/constants'

type TOSAgreementProps = {
  onAcceptAgreement: VoidFunction
}

const TOSAgreement: React.FC<TOSAgreementProps> = ({ onAcceptAgreement }) => {
  const { routes } = useRoute()
  const { t } = useTranslation('pagopa', { keyPrefix: 'tos', useSuspense: false })

  return (
    <StyledTOSAgreementLayout
      productName={t('title')}
      description={t('description')}
      onConfirm={onAcceptAgreement}
      sx={{ backgroundColor: LIGHT_GRAY, flex: 1 }}
    >
      <Typography sx={{ px: 8 }} color="text.secondary">
        <Trans components={{ 1: <StyledLink to={routes.TOS.PATH} underline="hover" /> }}>
          {t('termsDescription')}
        </Trans>
      </Typography>
    </StyledTOSAgreementLayout>
  )
}

export default TOSAgreement
