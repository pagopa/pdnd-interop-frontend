import { useTranslation } from 'react-i18next'
import { DelegationServices } from './delegation.services'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { DelegationQueries } from './delegation.queries'

function useCreateProducerDelegation() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'delegation.createProducerDelegation',
  })
  return useMutation({
    mutationFn: DelegationServices.createProducerDelegation,
    meta: {
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useApproveProducerDelegation() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'delegation.approveProducerDelegation',
  })
  return useMutation({
    mutationFn: DelegationServices.approveProducerDelegation,
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useRejectProducerDelegation() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'delegation.rejectProducerDelegation',
  })
  return useMutation({
    mutationFn: DelegationServices.rejectProducerDelegation,
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useRevokeProducerDelegation() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'delegation.revokeProducerDelegation',
  })
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: DelegationServices.revokeProducerDelegation,
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
    onSuccess(_, { delegationId }) {
      queryClient.removeQueries(DelegationQueries.getSingle({ delegationId }))
    },
  })
}

export const DelegationMutations = {
  useCreateProducerDelegation,
  useApproveProducerDelegation,
  useRejectProducerDelegation,
  useRevokeProducerDelegation,
}
