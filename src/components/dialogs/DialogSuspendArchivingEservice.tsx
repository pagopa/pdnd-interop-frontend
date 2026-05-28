import React from 'react'
import { Typography } from '@mui/material'
import { Trans, useTranslation } from 'react-i18next'
import { EServiceMutations } from '@/api/eservice'
import { useDialog } from '@/stores'
import type { DialogSuspendArchivingEserviceProps } from '@/types/dialog.types'
import { DialogConfirmArchivingAction } from './DialogConfirmArchivingAction'

export const DialogSuspendArchivingEservice: React.FC<DialogSuspendArchivingEserviceProps> = ({
  eserviceId,
  descriptorId,
}) => {
  const { t } = useTranslation('eservice', { keyPrefix: 'read.dialogSuspendArchivingEservice' })
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })
  const { closeDialog } = useDialog()
  const { mutate: suspend } = EServiceMutations.useSuspendVersion({ skipConfirmation: true })

  return (
    <DialogConfirmArchivingAction
      title={t('title')}
      intro={t('intro')}
      primaryBulletText={t('bullets.suspended')}
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
      confirmLabel={tCommon('suspend')}
      confirmColor="error"
      onConfirm={() => suspend({ eserviceId, descriptorId }, { onSuccess: closeDialog })}
    />
  )
}
