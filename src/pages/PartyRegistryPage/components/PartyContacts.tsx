import React from 'react'
import {
  InformationContainer,
  SectionContainer,
  SectionContainerSkeleton,
} from '@/components/layout/containers'
import { useTranslation } from 'react-i18next'
import { Button, Divider, Grid, Stack } from '@mui/material'
import { useDialog } from '@/contexts'
import { PartyQueries } from '@/api/party/party.hooks'

export const PartyContacts: React.FC = () => {
  const { t } = useTranslation('party', { keyPrefix: 'contacts' })
  const { t: tCommon } = useTranslation('common')
  const { openDialog } = useDialog()

  const { data: user } = PartyQueries.useGetActiveUser()
  const email = user?.contactMail

  const handleOpenUpdateMailDialog = () => {
    const defaultValues = {
      contactEmail: email?.address ?? '',
      description: email?.description ?? '',
    }

    openDialog({ type: 'updatePartyMail', defaultValues })
  }

  return (
    <Grid container>
      <Grid item xs={7}>
        <SectionContainer title={t('title')} description={t('description')}>
          <Stack spacing={2}>
            <InformationContainer label={t('mailField.label')}>
              {email?.address ?? 'n/a'}
            </InformationContainer>
            <InformationContainer label={t('descriptionField.label')}>
              {email?.description ?? 'n/a'}
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
