import React from 'react'
import { Drawer } from '@/components/shared/Drawer'
import { Box, FormControlLabel, Stack, Switch, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { SectionContainer } from '@/components/layout/containers'
import { TenantMutations } from '@/api/tenant'

type DelegationAvailabilityDrawerProps = {
  isOpen: boolean
  onClose: VoidFunction
  isAvailableProducerDelegations: boolean
  isAvailableConsumerDelegations: boolean
}

export const DelegationAvailabilityDrawer: React.FC<DelegationAvailabilityDrawerProps> = ({
  isOpen,
  onClose,
  isAvailableProducerDelegations,
  isAvailableConsumerDelegations,
}) => {
  const { t } = useTranslation('party', { keyPrefix: 'delegations.availabilityTab' })
  const { t: tCommon } = useTranslation('shared-components')
  const { mutate: updateTenantDelegatedFeatures } =
    TenantMutations.useUpdateTenantDelegatedFeatures()

  const [checkedProducerDelegations, setCheckedProducerDelegations] = React.useState(
    isAvailableProducerDelegations
  )

  const [checkedConsumerDelegations, setCheckedConsumerDelegations] = React.useState(
    isAvailableConsumerDelegations
  )

  React.useEffect(() => {
    if (!isOpen) {
      if (checkedProducerDelegations !== isAvailableProducerDelegations) {
        setCheckedProducerDelegations(isAvailableProducerDelegations)
      }

      if (checkedConsumerDelegations !== isAvailableConsumerDelegations) {
        setCheckedConsumerDelegations(isAvailableConsumerDelegations)
      }
    }
  }, [
    isAvailableProducerDelegations,
    isAvailableConsumerDelegations,
    isOpen,
    checkedProducerDelegations,
    checkedConsumerDelegations,
  ])

  function handleSubmit() {
    if (
      checkedConsumerDelegations !== isAvailableConsumerDelegations ||
      checkedProducerDelegations !== isAvailableProducerDelegations
    ) {
      updateTenantDelegatedFeatures({
        isDelegatedConsumerFeatureEnabled: checkedConsumerDelegations,
        isDelegatedProducerFeatureEnabled: checkedProducerDelegations,
      })
    }

    onClose()
  }

  return (
    <Drawer
      title={t('title')}
      isOpen={isOpen}
      onClose={onClose}
      buttonAction={{
        action: handleSubmit,
        label: tCommon('drawer.updateLabel'),
      }}
    >
      <Stack spacing={4} mb={3}>
        <Box>
          <SectionContainer innerSection>
            <Stack spacing={2}>
              <Typography sx={{ fontWeight: 700 }}>{t('consumeDelegation.label')}</Typography>
              <Typography>{t('consumeDelegation.infoLabel')}</Typography>
              <FormControlLabel
                control={
                  <Switch
                    sx={{ marginRight: 1 }}
                    checked={checkedConsumerDelegations}
                    onChange={() => {
                      setCheckedConsumerDelegations((prev) => !prev)
                    }}
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
                    sx={{ marginRight: 1 }}
                    checked={checkedProducerDelegations}
                    onChange={() => {
                      setCheckedProducerDelegations((prev) => !prev)
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
