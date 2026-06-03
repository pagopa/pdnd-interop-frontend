import React from 'react'
import { Drawer } from '@/components/shared/Drawer'
import { Stack, Typography } from '@mui/material'
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
      <Stack spacing={0.5}>
        <Typography variant="body2" fontWeight={600}>
          {t('reasonLabel')}
        </Typography>
        <Typography variant="body2">{archivingReason}</Typography>
      </Stack>
    </Drawer>
  )
}
