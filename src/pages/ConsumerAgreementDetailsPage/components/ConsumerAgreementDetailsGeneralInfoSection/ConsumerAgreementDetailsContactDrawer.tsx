import type { Mail } from '@/api/api.generatedTypes'
import { Drawer } from '@/components/shared/Drawer'
import { Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'

type ConsumerAgreementDetailsContactDrawerProps = {
  isOpen: boolean
  onClose: VoidFunction
  contact: Mail
}

export const ConsumerAgreementDetailsContactDrawer: React.FC<
  ConsumerAgreementDetailsContactDrawerProps
> = ({ isOpen, onClose, contact }) => {
  const { t } = useTranslation('agreement', {
    keyPrefix: 'consumerRead.sections.generalInformations.contactDrawer',
  })

  const handleCloseDrawer = () => {
    onClose()
  }

  return (
    <Drawer isOpen={isOpen} onClose={handleCloseDrawer} title={t('title')}>
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
