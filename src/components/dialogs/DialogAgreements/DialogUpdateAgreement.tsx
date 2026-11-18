import { useDialog } from '@/stores'
import type { DialogUpdateAgreementProps } from '@/types/dialog.types'
import { MIDialog as Dialog } from '@pagopa/mui-italia'
import React from 'react'
import { useTranslation } from 'react-i18next'

export const DialogUpdateAgreement: React.FC<DialogUpdateAgreementProps> = ({}) => {
  const { t: tCommon } = useTranslation('common')
  const ariaLabelId = React.useId()
  const { closeDialog } = useDialog()
  return (
    <Dialog
      aria-labelledby={ariaLabelId}
      onClose={closeDialog}
      onCloseButtonClick={closeDialog}
      closeButtonAriaLabel={tCommon('closeBtn')}
      maxWidth="md"
      open
    >
      Update Agreement
    </Dialog>
  )
}
