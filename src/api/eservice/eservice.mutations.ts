import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import type {
  EServiceDescriptorSeed,
  EServiceRiskAnalysisSeed,
  UpdateEServiceDescriptorSeed,
} from '../api.generatedTypes'
import { EServiceServices } from './eservice.services'
import { EServiceQueries } from './eservice.queries'

function useCreateDraft() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'eservice.createDraft' })
  return useMutation({
    mutationFn: EServiceServices.createDraft,
    meta: {
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useUpdateDraft() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'eservice.updateDraft' })
  return useMutation({
    mutationFn: EServiceServices.updateDraft,
    meta: {
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useDeleteDraft() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'eservice.deleteDraft' })
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: EServiceServices.deleteDraft,
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
      confirmationDialog: {
        title: t('confirmDialog.title'),
        description: t('confirmDialog.description'),
      },
    },
    onSuccess(_, { eserviceId }) {
      queryClient.removeQueries(EServiceQueries.getSingle(eserviceId))
    },
  })
}

function useCloneFromVersion() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'eservice.cloneFromVersion' })

  return useMutation({
    mutationFn: EServiceServices.cloneFromVersion,
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

function useCreateVersionDraft(
  config = { suppressSuccessToast: false, showConfirmationDialog: true }
) {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'eservice.createVersionDraft' })
  return useMutation({
    mutationFn: (
      payload: {
        eserviceId: string
      } & EServiceDescriptorSeed
    ) => EServiceServices.createVersionDraft(payload),
    meta: {
      successToastLabel: config.suppressSuccessToast ? undefined : t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
      confirmationDialog: config.showConfirmationDialog
        ? {
            title: t('confirmDialog.title'),
            description: t('confirmDialog.description'),
          }
        : undefined,
    },
  })
}

function useUpdateVersionDraft(config = { suppressSuccessToast: false }) {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'eservice.updateVersionDraft',
  })
  return useMutation({
    mutationFn: (
      payload: {
        eserviceId: string
        descriptorId: string
      } & UpdateEServiceDescriptorSeed
    ) => EServiceServices.updateVersionDraft(payload),
    meta: {
      successToastLabel: config.suppressSuccessToast ? undefined : t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function usePublishVersionDraft() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'eservice.publishVersionDraft',
  })
  return useMutation({
    mutationFn: EServiceServices.publishVersionDraft,
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

function useSuspendVersion() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'eservice.suspendVersion' })
  return useMutation({
    mutationFn: EServiceServices.suspendVersion,
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

function useReactivateVersion() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'eservice.reactivateVersion' })
  return useMutation({
    mutationFn: EServiceServices.reactivateVersion,
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

function useUpdateVersion() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'eservice.updateVersion' })
  return useMutation({
    mutationFn: EServiceServices.updateVersion,
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useDeleteVersionDraft() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'eservice.deleteVersionDraft',
  })
  return useMutation({
    mutationFn: EServiceServices.deleteVersionDraft,
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

function useAddEServiceRiskAnalysis(config = { suppressSuccessToast: false }) {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'eservice.addEServiceRiskAnalysis',
  })
  return useMutation({
    mutationFn: (
      payload: {
        eserviceId: string
      } & EServiceRiskAnalysisSeed
    ) => EServiceServices.addEServiceRiskAnalysis(payload),
    meta: {
      successToastLabel: config.suppressSuccessToast ? undefined : t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useUpdateEServiceRiskAnalysis(config = { suppressSuccessToast: false }) {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'eservice.updateEServiceRiskAnalysis',
  })
  return useMutation({
    mutationFn: (
      payload: {
        eserviceId: string
        riskAnalysisId: string
      } & EServiceRiskAnalysisSeed
    ) => EServiceServices.updateEServiceRiskAnalysis(payload),
    meta: {
      successToastLabel: config.suppressSuccessToast ? undefined : t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useDeleteEServiceRiskAnalysis() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'eservice.deleteEServiceRiskAnalysis',
  })
  return useMutation({
    mutationFn: EServiceServices.deleteEServiceRiskAnalysis,
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

function usePostVersionDraftDocument() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'eservice.postVersionDraftDocument',
  })
  return useMutation({
    mutationFn: EServiceServices.postVersionDraftDocument,
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useDeleteVersionDraftDocument() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'eservice.deleteVersionDraftDocument',
  })
  return useMutation({
    mutationFn: EServiceServices.deleteVersionDraftDocument,
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useUpdateVersionDraftDocumentDescription() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'eservice.updateVersionDraftDocumentDescription',
  })
  return useMutation({
    mutationFn: EServiceServices.updateVersionDraftDocumentDescription,
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useImportVersion() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'eservice.importVersion' })
  return useMutation({
    mutationFn: EServiceServices.importVersion,
    meta: {
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
      successToastLabel: t('outcome.success'),
    },
  })
}

export const EServiceMutations = {
  useCreateDraft,
  useUpdateDraft,
  useDeleteDraft,
  useCloneFromVersion,
  useCreateVersionDraft,
  useUpdateVersionDraft,
  usePublishVersionDraft,
  useSuspendVersion,
  useReactivateVersion,
  useUpdateVersion,
  useDeleteVersionDraft,
  useAddEServiceRiskAnalysis,
  useUpdateEServiceRiskAnalysis,
  useDeleteEServiceRiskAnalysis,
  usePostVersionDraftDocument,
  useDeleteVersionDraftDocument,
  useUpdateVersionDraftDocumentDescription,
  useImportVersion,
}
