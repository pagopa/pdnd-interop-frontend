import React from 'react'
import { SectionContainer } from '@/components/layout/containers'
import { useTranslation } from 'react-i18next'
import { Divider, Grid, Stack } from '@mui/material'
import { PartyQueries } from '@/api/party/party.hooks'
import { InformationContainer, InformationContainerSkeleton } from '@pagopa/interop-fe-commons'
import { ButtonSkeleton } from '@/components/shared/MUI-skeletons'
import { AuthHooks } from '@/api/auth'
import { UpdatePartyMailDrawer } from './UpdatePartyMailDrawer'
import EditIcon from '@mui/icons-material/Edit'

export const PartyContactsSection: React.FC = () => {
  const { t } = useTranslation('party', { keyPrefix: 'contacts' })
  const { t: tCommon } = useTranslation('common')
  const { isAdmin } = AuthHooks.useJwt()

  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)

  const handleOpenUpdateMailDialog = () => {
    setIsDrawerOpen(true)
  }

  const onCloseDrawer = () => {
    setIsDrawerOpen(false)
  }

  return (
    <Grid container>
      <Grid item xs={8}>
        <SectionContainer
          newDesign
          title={t('title')}
          topSideActions={
            isAdmin
              ? [
                  {
                    action: handleOpenUpdateMailDialog,
                    label: tCommon('actions.edit'),
                    color: 'primary',
                    icon: EditIcon,
                    variant: 'naked',
                  },
                ]
              : undefined
          }
        >
          <React.Suspense fallback={<PartyContactsSkeleton />}>
            <PartyContacts isDrawerOpen={isDrawerOpen} onCloseDrawer={onCloseDrawer} />
          </React.Suspense>
        </SectionContainer>
      </Grid>
    </Grid>
  )
}

type PartyContactsProps = {
  isDrawerOpen: boolean
  onCloseDrawer: VoidFunction
}

const PartyContacts: React.FC<PartyContactsProps> = ({ isDrawerOpen, onCloseDrawer }) => {
  const { t } = useTranslation('party', { keyPrefix: 'contacts' })

  const { data: user } = PartyQueries.useGetActiveUserParty()
  const email = user?.contactMail

  return (
    <>
      <Stack spacing={2}>
        <InformationContainer label={t('mailField.label')} content={email?.address || 'n/a'} />
        <InformationContainer
          label={t('descriptionField.label')}
          content={email?.description || 'n/a'}
          direction="column"
        />
      </Stack>
      <UpdatePartyMailDrawer
        key={String(isDrawerOpen)}
        isOpen={isDrawerOpen}
        onClose={onCloseDrawer}
        email={email}
      />
    </>
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
