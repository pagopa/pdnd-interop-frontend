import React from 'react'
import type { ProducerEServiceDescriptor } from '@/api/api.generatedTypes'
import { Drawer } from '@/components/shared/Drawer'
import { Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { useTranslation } from 'react-i18next'
import { secondsToMinutes } from '@/utils/format.utils'

type ProviderEServiceTechnicalInfoDrawerProps = {
  isOpen: boolean
  onClose: VoidFunction
  descriptor: ProducerEServiceDescriptor
}

export const ProviderEServiceTechnicalInfoDrawer: React.FC<
  ProviderEServiceTechnicalInfoDrawerProps
> = ({ descriptor, isOpen, onClose }) => {
  const { t } = useTranslation('eservice', { keyPrefix: 'read.drawers.technicalInfoDrawer' })
  const { t: tCommon } = useTranslation('common')

  const voucherLifespan = secondsToMinutes(descriptor.voucherLifespan)

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={t('title')}>
      <Stack spacing={3}>
        <InformationContainer
          label={t('technology')}
          content={descriptor.eservice.technology}
          direction="column"
        />

        <InformationContainer
          label={t('audience')}
          content={descriptor.audience[0]}
          direction="column"
        />

        <InformationContainer
          label={t('voucherLifespan')}
          content={`${voucherLifespan} ${tCommon('time.minute', {
            count: voucherLifespan,
          })}`}
          direction="column"
        />

        <InformationContainer
          label={t('dailyCallsPerConsumer')}
          content={`${descriptor.dailyCallsPerConsumer} ${t('callsPerDay')}`}
          direction="column"
        />

        <InformationContainer
          label={t('dailyCallsTotal')}
          content={`${descriptor.dailyCallsTotal} ${t('callsPerDay')}`}
          direction="column"
        />

        <InformationContainer
          label={t('mode.label')}
          content={t(`mode.value.${descriptor.eservice.mode}`)}
          direction="column"
        />
      </Stack>
    </Drawer>
  )
}
