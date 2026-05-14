import React from 'react'
import { Drawer } from '@/components/shared/Drawer'
import { Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { useTranslation } from 'react-i18next'

type ArchivingDetailsDrawerProps = {
  isOpen: boolean
  onClose: VoidFunction
  archivingReason: string | undefined
}

export const ArchivingDetailsDrawer: React.FC<ArchivingDetailsDrawerProps> = ({
  isOpen,
  onClose,
  archivingReason,
}) => {
  const { t } = useTranslation('agreement', {
    keyPrefix: 'consumerRead.archivingDetailsDrawer',
  })

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={t('title')} subtitle={t('subtitle')}>
      <Stack spacing={3}>
        <InformationContainer
          label={t('reasonLabel')}
          content={archivingReason ?? t('reasonPlaceholder')}
          direction="column"
        />
      </Stack>
    </Drawer>
  )
}
