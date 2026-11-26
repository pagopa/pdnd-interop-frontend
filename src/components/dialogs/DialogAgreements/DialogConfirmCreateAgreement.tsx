import React from 'react'
import { AgreementMutations } from '@/api/agreement'
import { useDialog } from '@/stores'
import type { DialogConfirmCreateAgreementProps } from '@/types/dialog.types'
import { MIDialog as Dialog } from '@pagopa/mui-italia'
import { useTranslation } from 'react-i18next'
import { useNavigate } from '@/router'

export const DialogConfirmCreateAgreement: React.FC<DialogConfirmCreateAgreementProps> = ({
  consumerId,
  descriptorId,
  eserviceId,
  producerId,
}) => {
  const { t: tCommon } = useTranslation('common')
  const { t } = useTranslation('eservice', {
    keyPrefix: 'consumer.detail.dialogs.agreements.subscribeConfirm',
  })

  const ariaLabelId = React.useId()
  const { closeDialog } = useDialog()
  const navigate = useNavigate()

  const owned = consumerId === producerId

  const { mutate: createAgreementDraft } = AgreementMutations.useCreateDraft(false)
  const { mutate: submitToOwnEService } = AgreementMutations.useSubmitToOwnEService(false)

  const onSubmit = () => {
    // If the consumer is the producer of the e-service, we can submit the agreement directly to the e-service without creating a draft
    if (owned) {
      submitToOwnEService(
        {
          eserviceId,
          descriptorId,
        },
        {
          onSuccess({ id }) {
            navigate('SUBSCRIBE_AGREEMENT_READ', { params: { agreementId: id } })
            closeDialog()
          },
        }
      )
      return
    } else {
      // If the consumer is not the producer of the e-service, we need to create a draft agreement first
      createAgreementDraft(
        {
          eserviceId,
          descriptorId,
          // These fields were required for the confirmation dialog, but we don't have them here, so we pass empty strings
          eserviceName: '',
          eserviceVersion: '',
        },
        {
          onSuccess({ id }) {
            navigate('SUBSCRIBE_AGREEMENT_EDIT', { params: { agreementId: id } })
            closeDialog()
          },
        }
      )
    }
  }

  return (
    <Dialog
      id={ariaLabelId}
      onClose={closeDialog}
      onCloseButtonClick={closeDialog}
      closeButtonAriaLabel={tCommon('closeBtn')}
      maxWidth="sm"
      PaperProps={{ sx: { p: 0 } }}
      title={t('title')}
      description={owned ? t('description.owned') : t('description.base')}
      open
      primaryAction={{
        label: tCommon('actions.confirm'),
        onClick: onSubmit,
      }}
      secondaryAction={{
        label: tCommon('actions.cancel'),
        onClick: () => closeDialog(),
      }}
    />
  )
}
