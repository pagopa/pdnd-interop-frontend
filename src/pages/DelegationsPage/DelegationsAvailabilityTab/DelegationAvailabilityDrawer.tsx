import React from 'react'
import { Drawer } from '@/components/shared/Drawer'
import { Box, FormControlLabel, Button, Stack, Switch, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { SectionContainer } from '@/components/layout/containers'
import { TenantHooks, TenantMutations } from '@/api/tenant'
import { AuthHooks } from '@/api/auth'
import { TenantFeature } from '@/api/api.generatedTypes'

type DelegationAvailabilityDrawerProps = {
  isOpen: boolean
  onClose: VoidFunction
  isAvailableProducerDelegations: boolean
  /*isAvailableConsumerDelegations: boolean
  setter: (produceDelegation: boolean, consumeDelegation: boolean) => void*/
}

export const DelegationAvailabilityDrawer: React.FC<DelegationAvailabilityDrawerProps> = ({
  isOpen,
  onClose,
  isAvailableProducerDelegations,
  //isAvailableConsumerDelegations,
  //setter,
}) => {
  const { t } = useTranslation('party', { keyPrefix: 'delegations.availabilityTab' })
  const { t: tCommon } = useTranslation('shared-components')
  const { mutate: setAssignProducerDelegationAvailabilty } =
    TenantMutations.useAssignTenantDelegatedProducerFeature()

  const [checkedProducerDelegations, setCheckedProducerDelegations] = React.useState(
    isAvailableProducerDelegations
  )

  /*const [checkedConsumerDelegations, setCheckedConsumerDelegations] = React.useState(
    isAvailableConsumerDelegations
  )*/ //TODO integrare con BE
  const checkedConsumerDelegations = false

  function handleClick() {
    if (checkedProducerDelegations === true) {
      setAssignProducerDelegationAvailabilty()
    }

    //setter(checkedProducerDelegations, checkedConsumerDelegations)
    onClose()
  }

  return (
    <Drawer
      title={t('title')}
      isOpen={isOpen}
      onClose={onClose}
      buttonAction={{
        action: handleClick,
        label: tCommon('drawer.updateLabel'),
      }}
    >
      <Stack spacing={4}>
        <Box>
          <SectionContainer innerSection>
            <Stack spacing={2}>
              <Typography sx={{ fontWeight: 700 }}>{t('consumeDelegation.label')}</Typography>
              <Typography>{t('consumeDelegation.infoLabel')}</Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={checkedConsumerDelegations}
                    /*onChange={() => {
                      setCheckedConsumerDelegations(!checkedConsumerDelegations)
                    }}*/
                  />
                }
                label={t('consumeDelegation.value.true')}
                labelPlacement="end"
                componentsProps={{ typography: { variant: 'body2' } }}
              />
            </Stack>
          </SectionContainer>
          <SectionContainer innerSection>
            <Stack spacing={2}>
              <Typography sx={{ fontWeight: 700 }}>{t('produceDelegation.label')}</Typography>
              <Typography>{t('produceDelegation.infoLabel')}</Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={checkedProducerDelegations}
                    onChange={() => {
                      setCheckedProducerDelegations(!checkedProducerDelegations)
                    }}
                  />
                }
                label={t('produceDelegation.value.true')}
                labelPlacement="end"
                componentsProps={{ typography: { variant: 'body2' } }}
              />
            </Stack>
          </SectionContainer>
        </Box>
      </Stack>
    </Drawer>
  )
}
