import type { Mail } from '@/api/api.generatedTypes'
import { Drawer } from '@/components/shared/Drawer'
import { Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'

type ProviderAgreementDetailsContactDrawerProps = {
  isOpen: boolean
  onClose: VoidFunction
  contact: Mail
  isDelegatedConsumer?: boolean
}

export const ProviderAgreementDetailsContactDrawer: React.FC<
  ProviderAgreementDetailsContactDrawerProps
> = ({ isOpen, onClose, contact, isDelegatedConsumer }) => {
  const { t } = useTranslation('agreement', {
    keyPrefix: 'providerRead.sections.generalInformations.contactDrawer',
  })

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={t(isDelegatedConsumer ? 'title.delegatedConsumer' : 'title.consumer')}
    >
      <Stack spacing={2}>
        <InformationContainer
          label={t('emailField.label')}
          direction="column"
          content={contact.address}
        />
        {contact.description && (
          <InformationContainer
            label={t('notesField.label')}
            direction="column"
            content={contact.description}
          />
        )}
      </Stack>
    </Drawer>
  )
}
