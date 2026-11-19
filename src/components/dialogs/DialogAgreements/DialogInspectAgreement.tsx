import { useDialog } from '@/stores'
import type { DialogInspectAgreementProps } from '@/types/dialog.types'
import { Stack } from '@mui/material'
import { MIDialog as Dialog } from '@pagopa/mui-italia'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ConsumerSelector } from './components/ConsumerSelector'
import { useNavigate } from '@/router'

export const DialogInspectAgreement: React.FC<DialogInspectAgreementProps> = ({
  agreements,
  consumers,
}) => {
  const [consumerId, setConsumerId] = useState<string>('')
  const { t: tCommon } = useTranslation('common')
  const { t } = useTranslation('eservice', {
    keyPrefix: 'consumer.detail.dialogs.agreements.inspect',
  })
  const ariaLabelId = React.useId()
  const { closeDialog } = useDialog()
  const navigate = useNavigate()

  const onSubmit = useCallback(() => {
    if (!consumerId) return

    const agreement = agreements.find((agreement) => agreement.consumerId === consumerId)

    if (!agreement) return

    navigate('SUBSCRIBE_AGREEMENT_READ', {
      params: {
        agreementId: agreement.id,
      },
    })
    closeDialog()
  }, [agreements, consumerId, navigate, closeDialog])

  return (
    <Dialog
      aria-labelledby={ariaLabelId}
      onClose={closeDialog}
      onCloseButtonClick={closeDialog}
      closeButtonAriaLabel={tCommon('closeBtn')}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          p: 0,
        },
      }}
      title={t('title')}
      open
      primaryAction={{
        label: t('actions.confirm'),
        onClick: onSubmit,
        disabled: !consumerId,
      }}
      secondaryAction={{
        label: tCommon('actions.cancel'),
        onClick: () => closeDialog(),
      }}
    >
      <Stack gap={3} sx={{ px: 3 }}>
        <ConsumerSelector
          consumers={consumers}
          onChange={(consumerId: string) => setConsumerId(consumerId)}
        />
      </Stack>
    </Dialog>
  )
}
