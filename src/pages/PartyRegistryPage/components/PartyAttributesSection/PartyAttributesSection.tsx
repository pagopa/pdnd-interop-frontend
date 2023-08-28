import React from 'react'
import { SectionContainer } from '@/components/layout/containers'
import { Divider, Grid } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { CertifiedAttributes } from './CertifiedPartyAttributes'
import { VerifiedAttributes } from './VerifiedPartyAttributes'
import { DeclaredAttributes } from './DeclaredPartyAttributes'

export const PartyAttributesSection: React.FC = () => {
  const { t } = useTranslation('party', { keyPrefix: 'attributes' })

  return (
    <Grid container>
      <Grid item xs={8}>
        <SectionContainer
          newDesign
          component="div"
          title={t('title')}
          description={t('description')}
        >
          <Divider sx={{ my: 3 }} />
          <CertifiedAttributes />
          <Divider sx={{ my: 3 }} />
          <VerifiedAttributes />
          <Divider sx={{ my: 3 }} />
          <DeclaredAttributes />
        </SectionContainer>
      </Grid>
    </Grid>
  )
}
