import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { AttributeServices } from './attribute.services'

function useCreateCertified() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'attribute.create' })
  return useMutation({
    mutationFn: AttributeServices.createCertified,
    meta: {
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
      successToastLabel: t('outcome.success'),
    },
  })
}

function useCreateVerified() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'attribute.create' })
  return useMutation({
    mutationFn: AttributeServices.createVerified,
    meta: {
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useCreateDeclared() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'attribute.create' })
  return useMutation({
    mutationFn: AttributeServices.createDeclared,
    meta: {
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useAddCertifiedAttribute() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'attribute.addCertifiedAttribute',
  })
  return useMutation({
    mutationFn: AttributeServices.addCertifiedAttribute,
    meta: {
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
      successToastLabel: t('outcome.success'),
    },
  })
}

function useRevokeCertifiedAttribute() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'attribute.revokeCertifiedAttribute',
  })
  return useMutation({
    mutationFn: AttributeServices.revokeCertifiedAttribute,
    meta: {
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
      successToastLabel: t('outcome.success'),
    },
  })
}

function useVerifyPartyAttribute() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'attribute.verifyPartyAttribute',
  })
  return useMutation({
    mutationFn: AttributeServices.verifyPartyAttribute,
    meta: {
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useUpdateVerifiedPartyAttribute() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'attribute.updatingExpirationPartyAttribute',
  })
  return useMutation({
    mutationFn: AttributeServices.updateVerifiedPartyAttribute,
    meta: {
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useRevokeVerifiedPartyAttribute() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'attribute.revokeVerifiedPartyAttribute',
  })
  return useMutation({
    mutationFn: AttributeServices.revokeVerifiedPartyAttribute,
    meta: {
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useDeclarePartyAttribute() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'attribute.declarePartyAttribute',
  })
  return useMutation({
    mutationFn: AttributeServices.declarePartyAttribute,
    meta: {
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
      confirmationDialog: {
        title: t('confirmDialog.title'),
        description: t('confirmDialog.description'),
      },
    },
  })
}

function useRevokeDeclaredPartyAttribute() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'attribute.revokeDeclaredPartyAttribute',
  })
  return useMutation({
    mutationFn: AttributeServices.revokeDeclaredPartyAttribute,
    meta: {
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
      confirmationDialog: {
        title: t('confirmDialog.title'),
        description: t('confirmDialog.description'),
      },
    },
  })
}

export const AttributeMutations = {
  useCreateCertified,
  useCreateVerified,
  useCreateDeclared,
  useAddCertifiedAttribute,
  useRevokeCertifiedAttribute,
  useVerifyPartyAttribute,
  useUpdateVerifiedPartyAttribute,
  useRevokeVerifiedPartyAttribute,
  useDeclarePartyAttribute,
  useRevokeDeclaredPartyAttribute,
}
