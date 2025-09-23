import React from 'react'
import type { CatalogEServiceDescriptor } from '@/api/api.generatedTypes'
import { Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { useTranslation } from 'react-i18next'
import { Drawer } from '@/components/shared/Drawer'

type ConsumerEServiceProducerContactsDrawerProps = {
  isOpen: boolean
  onClose: VoidFunction
  descriptor: CatalogEServiceDescriptor
}

export const ConsumerEServiceProducerContactsDrawer: React.FC<
  ConsumerEServiceProducerContactsDrawerProps
> = ({ isOpen, onClose, descriptor }) => {
  const { t } = useTranslation('eservice', { keyPrefix: 'read.drawers.producerContactsInfoDrawer' })

  if (!descriptor.eservice.mail) return null

  return (
    <Drawer title={t('title')} isOpen={isOpen} onClose={onClose}>
      <Stack spacing={3}>
        <InformationContainer
          label={t('email')}
          content={descriptor.eservice.mail.address}
          direction="column"
        />
        {descriptor.eservice.mail.description && (
          <InformationContainer
            label={t('notes')}
            content={descriptor.eservice.mail.description}
            direction="column"
          />
        )}
      </Stack>
    </Drawer>
  )
}
