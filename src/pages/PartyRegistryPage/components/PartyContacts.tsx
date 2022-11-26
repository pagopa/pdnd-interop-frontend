import React from 'react'
import {
  InformationContainer,
  SectionContainer,
  SectionContainerSkeleton,
} from '@/components/layout/containers'
import { useTranslation } from 'react-i18next'
import { Button, Divider, Grid, Stack } from '@mui/material'
import { useDialog } from '@/contexts'

export const PartyContacts: React.FC = () => {
  const { t } = useTranslation('party', { keyPrefix: 'contacts' })
  const { t: tCommon } = useTranslation('common')
  const { openDialog } = useDialog()

  const handleOpenUpdateMailDialog = () => {
    openDialog({ type: 'updatePartyMail' })
  }

  return (
    <Grid container>
      <Grid item xs={7}>
        <SectionContainer title={t('title')} description={t('description')}>
          <Stack spacing={2}>
            <InformationContainer label={t('mailField.label')}>
              {'mail?.address'}
            </InformationContainer>
            <InformationContainer label={t('descriptionField.label')}>
              {'mail?.description'}
            </InformationContainer>
            <Divider />
            <Stack alignItems="center">
              <Button onClick={handleOpenUpdateMailDialog} variant="outlined">
                {tCommon('actions.edit')}
              </Button>
            </Stack>
          </Stack>
        </SectionContainer>
      </Grid>
    </Grid>
  )
}

export const PartyContactsSkeleton: React.FC = () => {
  return (
    <Grid container>
      <Grid item xs={7}>
        <SectionContainerSkeleton />
      </Grid>
    </Grid>
  )
}
