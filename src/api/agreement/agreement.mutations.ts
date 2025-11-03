import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { AgreementServices } from './agreement.services'
import type { AgreementPayload, AgreementSubmissionPayload } from '../api.generatedTypes'

function useCreateDraft(hasConfirmationDialog = true) {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'agreement.createDraft' })
  return useMutation({
    mutationFn: ({
      eserviceId,
      descriptorId,
      delegationId,
    }: {
      eserviceName: string
      eserviceVersion: number | undefined
    } & AgreementPayload) =>
      AgreementServices.createDraft({ eserviceId, descriptorId, delegationId }),
    meta: {
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
      confirmationDialog: hasConfirmationDialog
        ? {
            title: t('confirmDialog.title'),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            description: (variables: any) => {
              return t('confirmDialog.description', {
                name: variables.eserviceName,
                version: variables.eserviceVersion,
              })
            },
            proceedLabel: t('confirmDialog.proceedLabel'),
          }
        : undefined,
    },
  })
}

function useSubmitDraft(isDelegated = false) {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'agreement.submitDraft' })
  return useMutation({
    mutationFn: ({
      agreementId,
      consumerNotes,
    }: {
      delegatorName: string | undefined
    } & {
      agreementId: string
    } & AgreementSubmissionPayload) =>
      AgreementServices.submitDraft({ agreementId, consumerNotes }),
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
      confirmationDialog: {
        title: t('confirmDialog.title'),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        description: (variables: any) => {
          return isDelegated
            ? t('confirmDialog.description.isDelegated', {
                delegatorName: variables.delegatorName,
              })
            : t('confirmDialog.description.default')
        },
      },
    },
  })
}

function useSubmitToOwnEService() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'agreement.submitToOwnEService',
  })
  return useMutation({
    mutationFn: AgreementServices.submitToOwnEService,
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
      confirmationDialog: {
        title: t('confirmDialog.title'),
        description: t('confirmDialog.description'),
      },
    },
  })
}

function useDeleteDraft() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'agreement.deleteDraft' })
  return useMutation({
    mutationFn: AgreementServices.deleteDraft,
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
      confirmationDialog: {
        title: t('confirmDialog.title'),
        description: t('confirmDialog.description'),
      },
    },
  })
}

function useUpdateDraft() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'agreement.updateDraft' })
  return useMutation({
    mutationFn: AgreementServices.updateDraft,
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useUploadDraftDocument() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'agreement.uploadDraftDocument',
  })
  return useMutation({
    mutationFn: AgreementServices.uploadDraftDocument,
    meta: {
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useDeleteDraftDocument() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'agreement.deleteDraftDocument',
  })
  return useMutation({
    mutationFn: AgreementServices.deleteDraftDocument,
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useActivate() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'agreement.activate' })
  return useMutation({
    mutationFn: AgreementServices.activate,
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
      confirmationDialog: {
        title: t('confirmDialog.title'),
        description: t('confirmDialog.description'),
      },
    },
  })
}

function useReject() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'agreement.reject' })
  return useMutation({
    mutationFn: AgreementServices.reject,
    meta: {
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useClone() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'agreement.clone' })
  return useMutation({
    mutationFn: AgreementServices.clone,
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
      confirmationDialog: {
        title: t('confirmDialog.title'),
        description: t('confirmDialog.description'),
      },
    },
  })
}

function useSuspend() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'agreement.suspend' })
  return useMutation({
    mutationFn: AgreementServices.suspend,
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
      confirmationDialog: {
        title: t('confirmDialog.title'),
        description: t('confirmDialog.description'),
      },
    },
  })
}

function useArchive() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'agreement.archive' })
  return useMutation({
    mutationFn: AgreementServices.archive,
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
      confirmationDialog: {
        title: t('confirmDialog.title'),
        description: t('confirmDialog.description'),
      },
    },
  })
}

function useUpgrade() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'agreement.upgrade' })
  return useMutation({
    mutationFn: AgreementServices.upgrade,
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

export const AgreementMutations = {
  useCreateDraft,
  useSubmitDraft,
  useSubmitToOwnEService,
  useDeleteDraft,
  useUpdateDraft,
  useUploadDraftDocument,
  useDeleteDraftDocument,
  useActivate,
  useReject,
  useSuspend,
  useArchive,
  useUpgrade,
  useClone,
}
