import React from 'react'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { useTranslation } from 'react-i18next'
import { Grid, Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { AuthHooks } from '@/api/auth'
import EditIcon from '@mui/icons-material/Edit'
import { DelegationAvailabilityDrawer } from './DelegationAvailabilityDrawer'
import { DelegatedProducer, TenantFeature } from '@/api/api.generatedTypes'
import { TenantHooks, TenantMutations } from '@/api/tenant'
import { timeStamp } from 'console'

export const DelegationsAvailabilityTab: React.FC = () => {
  const { t } = useTranslation('party', { keyPrefix: 'delegations.availabilityTab' })
  const { t: tCommon } = useTranslation('common')
  const { isAdmin } = AuthHooks.useJwt()

  const { data: activeTenant } = TenantHooks.useGetActiveUserParty()
  const producerDelegations = activeTenant.features.find(
    (feature): feature is Extract<TenantFeature, { delegatedProducer?: unknown }> =>
      Boolean('delegatedProducer' in feature && feature.delegatedProducer?.availabilityTimestamp)
  )?.delegatedProducer?.availabilityTimestamp

  const isAvailableProducerDelegations = producerDelegations ? true : false

  //const [isAvailableProducerDelegations, setIsAvailableProducerDelegations] = React.useState(false) //TODO da sostituire con il campo BE
  const [isAvailableConsumerDelegations, setIsAvailableConsumerDelegations] = React.useState(false) //TODO da sostituire con il campo BE

  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)

  const handleOpenDrawer = () => {
    setIsDrawerOpen(true)
  }

  const onCloseDrawer = () => {
    setIsDrawerOpen(false)
  }

  /*const handleChange = (produceDelegation: boolean, consumeDelegation: boolean) => {
    //TODO
    //setIsAvailableProducerDelegations(produceDelegation)
    setIsAvailableConsumerDelegations(consumeDelegation)
    TenantMutations.useUpdateDelegateProducerAvailability()
  }*/

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
                />
                <InformationContainer
                  label={t('produceDelegation.label')}
                  labelDescription={t('produceDelegation.infoLabel')}
                  content={t(`consumeDelegation.value.${isAvailableProducerDelegations}`)}
                />
              </Stack>
            </SectionContainer>
          </Stack>
        </SectionContainer>
        <DelegationAvailabilityDrawer
          isOpen={isDrawerOpen}
          onClose={onCloseDrawer}
          //isAvailableConsumerDelegations={isAvailableConsumerDelegations}
          isAvailableProducerDelegations={isAvailableProducerDelegations}
          //setter={handleChange}
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
