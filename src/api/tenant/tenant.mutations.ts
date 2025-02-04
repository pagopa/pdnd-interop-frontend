import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { TenantServices } from './tenant.services'

function useUpdateMail() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'party.updateMail' })
  return useMutation({
    mutationFn: TenantServices.updateMail,
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useAssignTenantDelegatedProducerFeature() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'party.updateDelegationAvailability',
  })
  return useMutation({
    mutationFn: TenantServices.assignTenantDelegatedProducerFeature,
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useDeleteTenantDelegatedProducerFeature() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'party.updateDelegationAvailability',
  })
  return useMutation({
    mutationFn: TenantServices.deleteTenantDelegatedProducerFeature,
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useAssignTenantDelegatedConsumerFeature() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'party.updateDelegationAvailability',
  })
  return useMutation({
    mutationFn: TenantServices.assignTenantDelegatedConsumerFeature,
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useDeleteTenantDelegatedConsumerFeature() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'party.updateDelegationAvailability',
  })
  return useMutation({
    mutationFn: TenantServices.deleteTenantDelegatedConsumerFeature,
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

export const TenantMutations = {
  useUpdateMail,
  useAssignTenantDelegatedProducerFeature,
  useDeleteTenantDelegatedProducerFeature,
  useAssignTenantDelegatedConsumerFeature,
  useDeleteTenantDelegatedConsumerFeature,
}
