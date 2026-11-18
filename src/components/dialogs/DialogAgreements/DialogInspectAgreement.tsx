import { useDialog } from '@/stores'
import type { DialogInspectAgreementProps } from '@/types/dialog.types'
import { MIDialog as Dialog } from '@pagopa/mui-italia'
import React from 'react'
import { useTranslation } from 'react-i18next'

export const DialogInspectAgreement: React.FC<DialogInspectAgreementProps> = ({}) => {
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
      Inspect Agreement
    </Dialog>
  )
}
