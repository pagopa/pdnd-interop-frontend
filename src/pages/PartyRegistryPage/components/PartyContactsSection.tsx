import React from 'react'
import { SectionContainer } from '@/components/layout/containers'
import { useTranslation } from 'react-i18next'
import { Button, Divider, Grid, Stack } from '@mui/material'
import { useDialog } from '@/stores'
import { PartyQueries } from '@/api/party/party.hooks'
import { InformationContainer, InformationContainerSkeleton } from '@pagopa/interop-fe-commons'
import { ButtonSkeleton } from '@/components/shared/MUI-skeletons'
import { AuthHooks } from '@/api/auth'

export const PartyContactsSection: React.FC = () => {
  const { t } = useTranslation('party', { keyPrefix: 'contacts' })

  return (
    <Grid container>
      <Grid item xs={7}>
        <SectionContainer newDesign title={t('title')} description={t('description')}>
          <React.Suspense fallback={<PartyContactsSkeleton />}>
            <PartyContacts />
          </React.Suspense>
        </SectionContainer>
      </Grid>
    </Grid>
  )
}

const PartyContacts: React.FC = () => {
  const { t } = useTranslation('party', { keyPrefix: 'contacts' })
  const { t: tCommon } = useTranslation('common')
  const { isAdmin } = AuthHooks.useJwt()

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
  )
}

export const PartyContactsSkeleton: React.FC = () => {
  const { isAdmin } = AuthHooks.useJwt()

  return (
    <Stack spacing={2}>
      <InformationContainerSkeleton />
      <InformationContainerSkeleton />
      {isAdmin && (
        <>
          <Divider />
          <Stack alignItems="center">
            <ButtonSkeleton width={92} />
          </Stack>
        </>
      )}
    </Stack>
  )
}
