import React from 'react'
import { Typography } from '@mui/material'
import { Trans, useTranslation } from 'react-i18next'
import { EServiceMutations } from '@/api/eservice'
import { useDialog } from '@/stores'
import type { DialogReactivateArchivingEserviceProps } from '@/types/dialog.types'
import { DialogConfirmArchivingAction } from './DialogConfirmArchivingAction'

export const DialogReactivateArchivingEservice: React.FC<
  DialogReactivateArchivingEserviceProps
> = ({ eserviceId, descriptorId }) => {
  const { t } = useTranslation('eservice', { keyPrefix: 'read.dialogReactivateArchivingEservice' })
  const { closeDialog } = useDialog()
  const { mutate: reactivate } = EServiceMutations.useReactivateVersion({
    skipConfirmation: true,
    isArchivingContext: true,
  })

  return (
    <DialogConfirmArchivingAction
      title={t('title')}
      intro={t('intro')}
      primaryBulletText={t('bullets.usableAgain')}
      archivingNotAffectedBullet={
        <Trans
          t={t}
          i18nKey="bullets.archivingNotAffected"
          components={{
            strong: <Typography component="span" variant="inherit" fontWeight={600} />,
          }}
        />
      }
      archivedAfterNoticeText={t('bullets.archivedAfterNotice')}
      confirmLabel={t('proceedLabel')}
      onConfirm={() => reactivate({ eserviceId, descriptorId }, { onSuccess: closeDialog })}
    />
  )
}
