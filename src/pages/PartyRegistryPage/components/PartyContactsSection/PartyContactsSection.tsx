import React from 'react'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { useTranslation } from 'react-i18next'
import { Grid, Stack } from '@mui/material'
import { PartyQueries } from '@/api/party/party.hooks'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { AuthHooks } from '@/api/auth'
import { UpdatePartyMailDrawer } from './UpdatePartyMailDrawer'
import EditIcon from '@mui/icons-material/Edit'

export const PartyContactsSection: React.FC = () => {
  const { t } = useTranslation('party', { keyPrefix: 'contacts' })
  const { t: tCommon } = useTranslation('common')
  const { isAdmin } = AuthHooks.useJwt()

  const { data: user } = PartyQueries.useGetActiveUserParty()
  const email = user?.contactMail

  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)

  const handleOpenUpdateMailDrawer = () => {
    setIsDrawerOpen(true)
  }

  const onCloseDrawer = () => {
    setIsDrawerOpen(false)
  }

  return (
    <Grid container>
      <Grid item xs={8}>
        <SectionContainer
          title={t('title')}
          topSideActions={
            isAdmin
              ? [
                  {
                    action: handleOpenUpdateMailDrawer,
                    label: tCommon('actions.edit'),
                    color: 'primary',
                    icon: EditIcon,
                    variant: 'naked',
                  },
                ]
              : undefined
          }
        >
          <Stack spacing={2}>
            <InformationContainer label={t('mailField.label')} content={email?.address || 'n/a'} />
            <InformationContainer
              label={t('descriptionField.label')}
              content={email?.description || 'n/a'}
              direction="column"
            />
          </Stack>
          <UpdatePartyMailDrawer isOpen={isDrawerOpen} onClose={onCloseDrawer} email={email} />
        </SectionContainer>
      </Grid>
    </Grid>
  )
}

export const PartyContactsSectionSkeleton: React.FC = () => {
  return (
    <Grid container>
      <Grid item xs={8}>
        <SectionContainerSkeleton height={175} />
      </Grid>
    </Grid>
  )
}
