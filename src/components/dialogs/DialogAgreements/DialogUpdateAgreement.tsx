import { useNavigate, useParams } from '@/router'
import { useDialog } from '@/stores'
import type { DialogUpdateAgreementProps } from '@/types/dialog.types'
import { Stack } from '@mui/system'
import { MIDialog as Dialog, MIAlert as Alert } from '@pagopa/mui-italia'
import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ConsumerSelector } from './components/ConsumerSelector'
import { AgreementMutations } from '@/api/agreement'
import { EServiceQueries } from '@/api/eservice'
import { useQuery } from '@tanstack/react-query'
import { TenantQueries } from '@/api/tenant'
import { Actions } from './components/Actions'
import UpdateIcon from '@mui/icons-material/Update'
import { AuthHooks } from '@/api/auth'

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

  const tenantId = AuthHooks.useJwt().jwt?.organizationId ?? ''

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

  const disabled = useMemo(() => {
    return (
      !consumerId ||
      !descriptor ||
      isFetchingDescriptor ||
      isFetchingAttributes ||
      (consumerId !== descriptor.eservice.producer.id && !hasTenantCertifiedAttributes)
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
      description={t('description')}
      open
      renderFooter={
        <Actions
          confirm={{
            disabled: disabled,
            label: t('actions.confirm'),
            icon: <UpdateIcon />,
            error: error,
            onClick: onSubmit,
          }}
        />
      }
    >
      <Stack gap={3} sx={{ px: 3 }}>
        <ConsumerSelector
          consumers={consumers}
          onChange={(consumerId: string) => setConsumerId(consumerId)}
          error={error}
        />
        <AttributesAlert
          consumerId={consumerId}
          producerId={descriptor?.eservice.producer.id}
          tenantId={tenantId}
          hasTenantCertifiedAttributes={hasTenantCertifiedAttributes}
        />
      </Stack>
    </Dialog>
  )
}

const AttributesAlert: React.FC<{
  hasTenantCertifiedAttributes?: boolean
  tenantId?: string
  consumerId?: string
  producerId?: string
}> = ({ hasTenantCertifiedAttributes, consumerId, tenantId, producerId }) => {
  const { t } = useTranslation('eservice', {
    keyPrefix: 'consumer.detail.dialogs.agreements.update',
  })

  if (!consumerId || !producerId || !tenantId || hasTenantCertifiedAttributes === undefined)
    return null

  if (consumerId === tenantId) {
    // CONSUMER IS THE TENANT ITSELF

    if (!hasTenantCertifiedAttributes) {
      // CONSUMER IS NOT THE PRODUCER AND HE DOES NOT HAVE CERTIFIED ATTRIBUTES
      return <Alert severity="error">{t('alerts.missingAttributes')}</Alert>
    }
  }

  if (consumerId !== tenantId) {
    // CONSUMER IS NOT THE TENANT ITSELF
    if (consumerId !== producerId) {
      // CONSUMER IS NOT THE PRODUCER OF THE E-SERVICE
      if (!hasTenantCertifiedAttributes) {
        // CONSUMER IS NOT THE PRODUCER AND HE DOES NOT HAVE CERTIFIED ATTRIBUTES
        return <Alert severity="error">{t('alerts.missingAttributesDelegated')}</Alert>
      }

      return <Alert severity="info">{t('alerts.delegated')}</Alert>
    }
  }

  return null
}
