import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { AxiosError } from 'axios'
import { PurposeTemplateServices } from './purposeTemplate.services'

// Surfaced by the BFF when a link/unlink resource operation hits a 409.
// Sourced from `interop-be-monorepo/packages/purpose-template-process/src/model/domain/errors.ts`
// (BFF prefix `015` for purpose-template-process).
export const LINK_ALREADY_EXISTS_ERROR_CODES = ['015-0014', '015-0030'] as const
export const LINK_NOT_FOUND_ERROR_CODES = ['015-0017', '015-0033'] as const

function getErrorCode(error: unknown): string | undefined {
  if (!(error instanceof AxiosError)) return undefined
  return error.response?.data?.errors?.[0]?.code
}

function useCreateDraft() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'purposeTemplate.createDraft' })
  return useMutation({
    mutationFn: PurposeTemplateServices.createDraft,
    meta: {
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useUpdateDraft() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'purposeTemplate.updateDraft' })
  return useMutation({
    mutationFn: PurposeTemplateServices.updateDraft,
    meta: {
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useLinkEserviceToPurposeTemplate() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'purposeTemplate.linkEService' })
  return useMutation({
    mutationFn: PurposeTemplateServices.linkEserviceToPurposeTemplate,
    meta: {
      errorToastLabel: t('outcome.error'),
      successToastLabel: t('outcome.success'),
      loadingLabel: t('loading'),
    },
  })
}

function useUnlinkEserviceFromPurposeTemplate() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'purposeTemplate.unlinkEService',
  })
  return useMutation({
    mutationFn: PurposeTemplateServices.unlinkEserviceFromPurposeTemplate,
    meta: {
      errorToastLabel: t('outcome.error'),
      successToastLabel: t('outcome.success'),
      loadingLabel: t('loading'),
    },
  })
}

function useLinkResourceToPurposeTemplate() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'purposeTemplate.linkResource',
  })
  return useMutation({
    mutationFn: PurposeTemplateServices.linkResourceToPurposeTemplate,
    meta: {
      // BE returns 409 when the resource is already linked to this PT. The
      // active query is refetched by the global polling on settled, so the
      // user gets a sync'd list automatically; we just surface a clearer toast.
      errorToastLabel: (error: unknown) => {
        const code = getErrorCode(error)
        if (code && (LINK_ALREADY_EXISTS_ERROR_CODES as readonly string[]).includes(code)) {
          return t('outcome.conflict')
        }
        return t('outcome.error')
      },
      successToastLabel: t('outcome.success'),
      loadingLabel: t('loading'),
    },
  })
}

function useUnlinkResourceFromPurposeTemplate() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'purposeTemplate.unlinkResource',
  })
  return useMutation({
    mutationFn: PurposeTemplateServices.unlinkResourceFromPurposeTemplate,
    meta: {
      // BE returns 409 when the link no longer exists (race with another tab
      // or stale view). Surface a clearer toast; global polling re-syncs the list.
      errorToastLabel: (error: unknown) => {
        const code = getErrorCode(error)
        if (code && (LINK_NOT_FOUND_ERROR_CODES as readonly string[]).includes(code)) {
          return t('outcome.conflict')
        }
        return t('outcome.error')
      },
      successToastLabel: t('outcome.success'),
      loadingLabel: t('loading'),
    },
  })
}

function usePublishDraft() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'purposeTemplate.publishDraft' })
  return useMutation({
    mutationFn: PurposeTemplateServices.publishDraft,
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
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'purposeTemplate.deleteDraft' })
  return useMutation({
    mutationFn: PurposeTemplateServices.deleteDraft,
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

function useDeleteAnnotation() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'purposeTemplate.deleteAnnotation',
  })
  return useMutation({
    mutationFn: PurposeTemplateServices.deleteAnnotation,
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useDeleteDocument() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'purposeTemplate.deleteDocument',
  })
  return useMutation({
    mutationFn: PurposeTemplateServices.deleteDocumentFromAnnotation,
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useSuspendPurposeTemplate() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'purposeTemplate.suspendPurposeTemplate',
  })
  return useMutation({
    mutationFn: PurposeTemplateServices.suspendPurposeTemplate,
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

function useReactivatePurposeTemplate() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'purposeTemplate.activatePurposeTemplate',
  })
  return useMutation({
    mutationFn: PurposeTemplateServices.reactivatePurposeTemplate,
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

function useArchivePurposeTemplate() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'purposeTemplate.archivePurposeTemplate',
  })
  return useMutation({
    mutationFn: PurposeTemplateServices.archivePurposeTemplate,
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

function useAddAnnotationToAnswer() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'purposeTemplate.addAnnotationToAnswer',
  })
  return useMutation({
    mutationFn: PurposeTemplateServices.addRiskAnalysisAnswer,
    meta: {
      loadingLabel: t('loading'),
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
    },
  })
}

function useAddDocumentsToAnnotation() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'purposeTemplate.addDocumentsToAnswer',
  })
  return useMutation({
    mutationFn: PurposeTemplateServices.addDocumentToAnnotation,
    meta: {
      loadingLabel: t('loading'),
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
    },
  })
}

function useDownloadDocument() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'purposeTemplate.downloadDocument',
  })
  return useMutation({
    mutationFn: PurposeTemplateServices.getRiskAnalysisTemplateAnswerAnnotationDocument,
    meta: {
      loadingLabel: t('loading'),
      errorToastLabel: t('outcome.error'),
    },
  })
}

function useUpdatePrettyNameAnnotationAssociatedDocument() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'purposeTemplate.updatePrettyNameDocument',
  })

  return useMutation({
    mutationFn: PurposeTemplateServices.updatePrettyNameAnnotationAssociatedDocument,
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

export const PurposeTemplateMutations = {
  useUpdateDraft,
  useLinkEserviceToPurposeTemplate,
  useUnlinkEserviceFromPurposeTemplate,
  useLinkResourceToPurposeTemplate,
  useUnlinkResourceFromPurposeTemplate,
  useCreateDraft,
  usePublishDraft,
  useDeleteDraft,
  useDeleteAnnotation,
  useDeleteDocument,
  useSuspendPurposeTemplate,
  useReactivatePurposeTemplate,
  useArchivePurposeTemplate,
  useAddAnnotationToAnswer,
  useAddDocumentsToAnnotation,
  useDownloadDocument,
  useUpdatePrettyNameAnnotationAssociatedDocument,
}
