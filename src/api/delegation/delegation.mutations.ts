import { useTranslation } from 'react-i18next'
import { DelegationServices } from './delegation.services'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { DelegationQueries } from './delegation.queries'

function useCreateProducerDelegation() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'delegation.createDelegation',
  })
  return useMutation({
    mutationFn: DelegationServices.createProducerDelegation,
    meta: {
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
      successToastLabel: t('outcome.success'),
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
    keyPrefix: 'delegation.rejectDelegation',
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
    keyPrefix: 'delegation.revokeDelegation',
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

function useApproveConsumerDelegation() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'delegation.approveConsumerDelegation',
  })
  return useMutation({
    mutationFn: DelegationServices.approveConsumerDelegation,
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useRejectConsumerDelegation() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'delegation.rejectDelegation',
  })
  return useMutation({
    mutationFn: DelegationServices.rejectConsumerDelegation,
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useCreateProducerDelegationAndEservice() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'delegation.createDelegation',
  })
  return useMutation({
    mutationFn: DelegationServices.createProducerDelegationAndEservice,
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useCreateConsumerDelegation() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'delegation.createDelegation',
  })
  return useMutation({
    mutationFn: DelegationServices.createConsumerDelegation,
    meta: {
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
      successToastLabel: t('outcome.success'),
    },
  })
}

function useRevokeConsumerDelegation() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'delegation.revokeDelegation',
  })
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: DelegationServices.revokeConsumerDelegation,
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
  useApproveConsumerDelegation,
  useRejectConsumerDelegation,
  useCreateProducerDelegationAndEservice,
  useCreateConsumerDelegation,
  useRevokeConsumerDelegation,
}
