import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { PurposeTemplateServices } from './purposeTemplate.services'

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
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'purposeTemplate.createDraft' })
  return useMutation({
    mutationFn: PurposeTemplateServices.linkEserviceToPurposeTemplate,
    meta: {
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useUnlinkEserviceFromPurposeTemplate() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'purposeTemplate.createDraft' })
  return useMutation({
    mutationFn: PurposeTemplateServices.unlinkEserviceFromPurposeTemplate,
    meta: {
      errorToastLabel: t('outcome.error'),
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

export const PurposeTemplateMutations = {
  useUpdateDraft,
  useLinkEserviceToPurposeTemplate,
  useUnlinkEserviceFromPurposeTemplate,
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
}
