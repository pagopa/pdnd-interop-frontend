import { useNavigate, useParams } from '@/router'
import { useDialog } from '@/stores'
import type { DialogUpdateAgreementProps } from '@/types/dialog.types'
import { Stack } from '@mui/system'
import { MIDialog as Dialog } from '@pagopa/mui-italia'
import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ConsumerSelector } from './components/ConsumerSelector'
import { AgreementMutations } from '@/api/agreement'
import { EServiceQueries } from '@/api/eservice'
import { useQuery } from '@tanstack/react-query'
import { TenantQueries } from '@/api/tenant'

export const DialogUpdateAgreement: React.FC<DialogUpdateAgreementProps> = ({
  agreements,
  consumers,
}) => {
  const [consumerId, setConsumerId] = useState<string>('')
  const { t: tCommon } = useTranslation('common')
  const { t } = useTranslation('eservice', {
    keyPrefix: 'consumer.detail.dialogs.agreements.update',
  })
  const ariaLabelId = React.useId()
  const { closeDialog } = useDialog()
  const navigate = useNavigate()

  const { eserviceId, descriptorId } = useParams<'SUBSCRIBE_CATALOG_VIEW'>()

  const { data: descriptor, isFetching: isFetchingDescriptor } = useQuery(
    EServiceQueries.getDescriptorCatalog(eserviceId, descriptorId)
  )

  const { data: hasTenantCertifiedAttributes, isFetching: isFetchingAttributes } = useQuery({
    ...TenantQueries.getHasTenantCertifiedAttributes({
      eserviceId: eserviceId,
      descriptorId: descriptor?.eservice.activeDescriptor?.id ?? '',
      tenantId: consumerId,
    }),
    enabled: Boolean(consumerId) && Boolean(descriptor?.eservice.activeDescriptor),
    select: ({ hasCertifiedAttributes }) => hasCertifiedAttributes,
  })

  const { mutate: upgradeAgreement } = AgreementMutations.useUpgrade()

  const error = useMemo(() => {
    return (
      Boolean(consumerId) &&
      !isFetchingDescriptor &&
      !isFetchingAttributes &&
      consumerId !== descriptor?.eservice.producer.id &&
      !hasTenantCertifiedAttributes
    )
  }, [
    consumerId,
    descriptor,
    hasTenantCertifiedAttributes,
    isFetchingAttributes,
    isFetchingDescriptor,
  ])

  const onSubmit = useCallback(() => {
    if (!consumerId) return
    if (!descriptor) return
    if (!descriptor.eservice.activeDescriptor) return
    if (isFetchingDescriptor || isFetchingAttributes) return
    if (consumerId !== descriptor.eservice.producer.id && !hasTenantCertifiedAttributes) return

    const agreement = agreements.find((agreement) => agreement.consumerId === consumerId)

    if (!agreement) return

    upgradeAgreement(
      { agreementId: agreement.id },
      {
        onSuccess(data) {
          /**
           * When the subscriber is missing one or more verified/declared attributes,
           * the new agreement is created as a DRAFT instead of being submitted to
           * the provider. When this happens, the subscriber should be presented with
           * the "draft edit" view of the agreement.
           */
          const agreementView =
            data.state === 'DRAFT' ? 'SUBSCRIBE_AGREEMENT_EDIT' : 'SUBSCRIBE_AGREEMENT_READ'

          navigate(agreementView, {
            params: {
              agreementId: data.id,
            },
          })
          closeDialog()
        },
      }
    )
  }, [
    agreements,
    consumerId,
    descriptor,
    isFetchingAttributes,
    isFetchingDescriptor,
    hasTenantCertifiedAttributes,
    navigate,
    closeDialog,
    upgradeAgreement,
  ])

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
        color: error ? 'error' : 'primary',
        disabled:
          !consumerId ||
          !descriptor ||
          isFetchingDescriptor ||
          isFetchingAttributes ||
          (consumerId !== descriptor.eservice.producer.id && !hasTenantCertifiedAttributes),
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
          error={error}
        />
      </Stack>
    </Dialog>
  )
}
