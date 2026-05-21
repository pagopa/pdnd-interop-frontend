import { SectionContainer } from '@/components/layout/containers'
import { VerticalInformationContainer } from '@/components/shared/VerticalInformationContainer'
import { CLIENT_ASSERTION_ALG, CLIENT_ASSERTION_TYP } from '@/config/constants'
import { Grid } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

type DPoPAssertionHeaderProps = {
  keyPrefix: 'firstDPoPProofStep' | 'secondDPoPProofStep'
}

export const DPoPAssertionHeader: React.FC<DPoPAssertionHeaderProps> = ({ keyPrefix }) => {
  const { t } = useTranslation('voucher', { keyPrefix })

  return (
    <SectionContainer variant="outlined" title={t('assertionHeader.title')}>
      <Grid container columnSpacing={4.5} rowSpacing={3}>
        <VerticalInformationContainer
          label={t('assertionHeader.typField.label')}
          labelDescription={t('assertionHeader.typField.description')}
          content={CLIENT_ASSERTION_TYP}
          copyToClipboard={{
            value: CLIENT_ASSERTION_TYP,
            tooltipTitle: t('assertionHeader.typField.copySuccessFeedbackText'),
          }}
        />
        <VerticalInformationContainer
          label={t('assertionHeader.algField.label')}
          labelDescription={t('assertionHeader.algField.description')}
          content={CLIENT_ASSERTION_ALG}
          copyToClipboard={{
            value: CLIENT_ASSERTION_ALG,
            tooltipTitle: t('assertionHeader.algField.copySuccessFeedbackText'),
          }}
        />
        <VerticalInformationContainer
          label={t('assertionHeader.jwkField.label')}
          labelDescription={t('assertionHeader.jwkField.description')}
          content={t('assertionHeader.jwkField.suggestionLabel')}
        />
      </Grid>
    </SectionContainer>
  )
}
