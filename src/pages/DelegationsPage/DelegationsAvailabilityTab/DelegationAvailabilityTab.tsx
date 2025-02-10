import React from 'react'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { useTranslation } from 'react-i18next'
import { Grid, Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { AuthHooks } from '@/api/auth'
import EditIcon from '@mui/icons-material/Edit'
import { DelegationAvailabilityDrawer } from './DelegationAvailabilityDrawer'
import { TenantHooks } from '@/api/tenant'
import {
  hasTenantGivenConsumerDelegationAvailability,
  hasTenantGivenProducerDelegationAvailability,
} from '@/utils/tenant.utils'

export const DelegationsAvailabilityTab: React.FC = () => {
  return (
    <React.Suspense fallback={<DelegationsAvailabilitySectionSkeleton />}>
      <DelegationsAvailabilitySection />
    </React.Suspense>
  )
}

const DelegationsAvailabilitySection: React.FC = () => {
  const { t } = useTranslation('party', { keyPrefix: 'delegations.availabilityTab' })
  const { t: tCommon } = useTranslation('common')
  const { isAdmin } = AuthHooks.useJwt()

  const { data: activeTenant } = TenantHooks.useGetActiveUserParty()

  const isAvailableProducerDelegations = hasTenantGivenProducerDelegationAvailability(activeTenant)

  const isAvailableConsumerDelegations = hasTenantGivenConsumerDelegationAvailability(activeTenant)

  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)

  const handleOpenDrawer = () => {
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
                    action: handleOpenDrawer,
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
            <SectionContainer innerSection>
              <Stack spacing={2} sx={{ mt: 4 }}>
                <InformationContainer
                  label={t('consumeDelegation.label')}
                  labelDescription={t('consumeDelegation.infoLabel')}
                  content={t(`consumeDelegation.value.${isAvailableConsumerDelegations}`)}
                  sx={{ display: 'none', visibility: 'hidden' }} //TEMP needed to hide consumer delegation availability
                />
                <InformationContainer
                  label={t('produceDelegation.label')}
                  labelDescription={t('produceDelegation.infoLabel')}
                  content={t(`produceDelegation.value.${isAvailableProducerDelegations}`)}
                />
              </Stack>
            </SectionContainer>
          </Stack>
        </SectionContainer>
        <DelegationAvailabilityDrawer
          isOpen={isDrawerOpen}
          onClose={onCloseDrawer}
          isAvailableConsumerDelegations={isAvailableConsumerDelegations}
          isAvailableProducerDelegations={isAvailableProducerDelegations}
        />
      </Grid>
    </Grid>
  )
}

export const DelegationsAvailabilitySectionSkeleton: React.FC = () => {
  return (
    <Grid container>
      <Grid item xs={8}>
        <SectionContainerSkeleton height={175} />
      </Grid>
    </Grid>
  )
}
