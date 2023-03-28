import React from 'react'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { useTranslation } from 'react-i18next'
import { Button, Divider, Grid, Stack } from '@mui/material'
import { useDialog } from '@/stores'
import { PartyQueries } from '@/api/party/party.hooks'
import { useJwt } from '@/hooks/useJwt'
import { InformationContainer } from '@pagopa/interop-fe-commons'

export const PartyContacts: React.FC = () => {
  const { t } = useTranslation('party', { keyPrefix: 'contacts' })
  const { t: tCommon } = useTranslation('common')
  const { isAdmin } = useJwt()

  const { openDialog } = useDialog()

  const { data: user } = PartyQueries.useGetActiveUserParty()
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
            <InformationContainer label={t('mailField.label')} content={email?.address || 'n/a'} />
            <InformationContainer
              label={t('descriptionField.label')}
              content={email?.description || 'n/a'}
            />

            {isAdmin && (
              <>
                <Divider />
                <Stack alignItems="center">
                  <Button onClick={handleOpenUpdateMailDialog} variant="outlined">
                    {tCommon('actions.edit')}
                  </Button>
                </Stack>
              </>
            )}
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
        <SectionContainerSkeleton height={261} />
      </Grid>
    </Grid>
  )
}
