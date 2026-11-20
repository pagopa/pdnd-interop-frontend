import { useDialog } from '@/stores'
import type { DialogCreateAgreementProps } from '@/types/dialog.types'
import { MIDialog as Dialog, MIAlert as Alert } from '@pagopa/mui-italia'
import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ConsumerSelector } from './components/ConsumerSelector'
import { Stack } from '@mui/material'
import { AuthHooks } from '@/api/auth'
import { DelegationQueries } from '@/api/delegation'
import { TenantQueries } from '@/api/tenant'
import { useQuery } from '@tanstack/react-query'
import { EServiceQueries } from '@/api/eservice'
import { useNavigate, useParams } from '@/router'
import { AgreementMutations } from '@/api/agreement'

export const DialogCreateAgreement: React.FC<DialogCreateAgreementProps> = ({ consumers }) => {
  const [consumerId, setConsumerId] = useState<string>('')
  const { t: tCommon } = useTranslation('common')
  const { t } = useTranslation('eservice', {
    keyPrefix: 'consumer.detail.dialogs.agreements.subscribe',
  })
  const { closeDialog } = useDialog()
  const ariaLabelId = React.useId()

  const { eserviceId, descriptorId } = useParams<'SUBSCRIBE_CATALOG_VIEW'>()
  const navigate = useNavigate()
  const tenantId = AuthHooks.useJwt().jwt?.organizationId ?? ''

  const { data: descriptor, isFetching: isFetchingDescriptor } = useQuery(
    EServiceQueries.getDescriptorCatalog(eserviceId, descriptorId)
  )

  const { data: delegations, isFetching: isFetchingDelegations } = useQuery({
    ...DelegationQueries.getList({
      limit: 50,
      offset: 0,
      eserviceIds: [eserviceId],
      kind: 'DELEGATED_CONSUMER',
      states: ['ACTIVE'],
      delegateIds: [tenantId],
      delegatorIds: [consumerId],
    }),
    enabled: Boolean(tenantId) && Boolean(consumerId),
    select: ({ results }) => results,
  })

  const { data: hasTenantCertifiedAttributes, isFetching: isFetchingAttributes } = useQuery({
    ...TenantQueries.getHasTenantCertifiedAttributes({
      eserviceId: eserviceId,
      descriptorId: descriptorId,
      tenantId: consumerId,
    }),
    enabled: Boolean(consumerId),
    select: ({ hasCertifiedAttributes }) => hasCertifiedAttributes,
  })

  const isAsyncExchange = descriptor?.eservice.asyncExchange ?? false

  const { mutate: createAgreementDraft } = AgreementMutations.useCreateDraft(true, isAsyncExchange)
  const { mutate: submitToOwnEService } = AgreementMutations.useSubmitToOwnEService()

  const error = useMemo(() => {
    return (
      Boolean(consumerId) &&
      !isFetchingAttributes &&
      consumerId !== descriptor?.eservice.producer.id &&
      !hasTenantCertifiedAttributes
    )
  }, [consumerId, descriptor, hasTenantCertifiedAttributes, isFetchingAttributes])

  const onSubmit = useCallback(() => {
    if (!consumerId) return
    if (!tenantId) return
    if (!descriptor) return
    if (isFetchingAttributes || isFetchingDelegations || isFetchingDescriptor) return
    if (consumerId !== tenantId && delegations?.length === 0) return
    if (consumerId !== descriptor?.eservice.producer.id && !hasTenantCertifiedAttributes) return

    let delegationId: string | undefined = undefined

    if (consumerId !== tenantId) {
      // If the consumer is not the tenant itself (the current user has been delegated), we need to get the delegation ID from the list of delegations
      delegationId = delegations?.[0]?.id
    }

    // If the consumer is the producer of the e-service, we can submit the agreement directly to the e-service without creating a draft
    if (consumerId === descriptor?.eservice.producer.id) {
      submitToOwnEService(
        {
          eserviceId: descriptor.eservice.id,
          descriptorId: descriptor.id,
          delegationId: delegationId,
        },
        {
          onSuccess({ id }) {
            navigate('SUBSCRIBE_AGREEMENT_READ', { params: { agreementId: id } })
            closeDialog()
          },
        }
      )
      return
    }

    // If the consumer is not the producer of the e-service, we need to create a draft agreement first
    createAgreementDraft(
      {
        eserviceName: descriptor.eservice.name,
        eserviceId: descriptor.eservice.id,
        eserviceVersion: descriptor.version,
        descriptorId: descriptor.id,
        delegationId: delegationId,
      },
      {
        onSuccess({ id }) {
          navigate('SUBSCRIBE_AGREEMENT_EDIT', { params: { agreementId: id } })
          closeDialog()
        },
      }
    )
  }, [
    consumerId,
    tenantId,
    descriptor,
    delegations,
    hasTenantCertifiedAttributes,
    isFetchingAttributes,
    isFetchingDelegations,
    isFetchingDescriptor,
    submitToOwnEService,
    createAgreementDraft,
    navigate,
    closeDialog,
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
      description={
        tenantId === descriptor?.eservice.producer.id
          ? t('description.owned')
          : t('description.base')
      }
      open
      primaryAction={{
        label: tCommon('actions.confirm'),
        onClick: onSubmit,
        color: error ? 'error' : 'primary',
        disabled:
          !descriptor ||
          !tenantId ||
          !consumerId ||
          isFetchingAttributes ||
          isFetchingDelegations ||
          isFetchingDescriptor ||
          (consumerId !== descriptor?.eservice.producer.id && !hasTenantCertifiedAttributes) ||
          (consumerId !== tenantId && delegations?.length === 0),
      }}
      secondaryAction={{
        label: tCommon('actions.cancel'),
        onClick: () => closeDialog(),
      }}
    >
      <Stack gap={2} sx={{ px: 3 }}>
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
    keyPrefix: 'consumer.detail.dialogs.agreements.subscribe',
  })

  if (!consumerId || !producerId || !tenantId || hasTenantCertifiedAttributes === undefined)
    return null

  if (consumerId === tenantId) {
    // CONSUMER IS THE TENANT ITSELF

    if (consumerId === producerId) {
      // CONSUMER IS ALSO THE PRODUCER OF THE E-SERVICE
      // We inform the user that no further approval is needed, since the consumer is the producer of the e-service
      return <Alert severity="info">{t('alerts.owned')}</Alert>
    }

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

      if (tenantId === producerId) {
        // TENANT IS THE PRODUCER OF THE E-SERVICE
        return <Alert severity="info">{t('alerts.ownedDelegated')}</Alert>
      }

      return <Alert severity="info">{t('alerts.delegated')}</Alert>
    }
  }

  return null
}
