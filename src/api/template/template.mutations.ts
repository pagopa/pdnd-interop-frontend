import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { TemplateServices } from './template.services'

//TODO SUCCESS/ERROR/LOADING TOAST LABEL

function useUpdateEServiceTemplateName() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'template.updateEServiceTemplateName',
  })
  return useMutation({
    mutationFn: TemplateServices.updateEServiceTemplateName,
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useUpdateEServiceTemplateAudience() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'template.updateEServiceTemplateAudience',
  })
  return useMutation({
    mutationFn: TemplateServices.updateEServiceTemplateAudience,
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useUpdateTemplateEServiceDescription() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'eservice.updateEServiceDescription',
  })
  return useMutation({
    mutationFn: TemplateServices.updateTemplateEServiceDescription,
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useUpdateQuotas() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'eservice.updateVersion' })
  return useMutation({
    mutationFn: TemplateServices.updateEServiceTemplateQuotas, //TODO
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function usePostVersionDraftDocument() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'eservice.postVersionDraftDocument',
  })
  return useMutation({
    mutationFn: TemplateServices.postVersionDraftDocument,
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
    mutationFn: TemplateServices.deleteVersionDraftDocument,
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
    mutationFn: TemplateServices.updateVersionDraftDocumentDescription,
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useCreateDraft() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'template.createDraft' })
  return useMutation({
    mutationFn: TemplateServices.createDraft,
    meta: {
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useUpdateDraft() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'eservice.updateDraft' })
  return useMutation({
    mutationFn: TemplateServices.updateDraft,
    meta: {
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
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
      } //& UpdateEServiceTemplateSeed TODO
    ) => TemplateServices.updateVersionDraft(payload),
    meta: {
      successToastLabel: config.suppressSuccessToast ? undefined : t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useAddTemplateRiskAnalysis(config = { suppressSuccessToast: false }) {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'eservice.addEServiceRiskAnalysis',
  })
  return useMutation({
    mutationFn: (
      payload: {
        eserviceTemplateId: string
      } & EServiceRiskAnalysisSeed
    ) => TemplateServices.addTemplateRiskAnalysis(payload),
    meta: {
      successToastLabel: config.suppressSuccessToast ? undefined : t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useUpdateTemplateRiskAnalysis(config = { suppressSuccessToast: false }) {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'eservice.updateEServiceRiskAnalysis',
  })
  return useMutation({
    mutationFn: (
      payload: {
        eserviceTemplateId: string
        riskAnalysisId: string
      } & EServiceRiskAnalysisSeed
    ) => TemplateServices.updateTemplateRiskAnalysis(payload),
    meta: {
      successToastLabel: config.suppressSuccessToast ? undefined : t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useDeleteTemplateRiskAnalysis() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'eservice.deleteEServiceRiskAnalysis',
  })
  return useMutation({
    mutationFn: TemplateServices.deleteTemplateRiskAnalysis,
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

export const TemplateMutations = {
  useUpdateEServiceTemplateName,
  useUpdateEServiceTemplateAudience,
  useUpdateTemplateEServiceDescription,
  useUpdateQuotas,
  usePostVersionDraftDocument,
  useDeleteVersionDraftDocument,
  useUpdateVersionDraftDocumentDescription,
  useCreateDraft,
  useUpdateDraft,
  useUpdateVersionDraft,
  useAddTemplateRiskAnalysis,
  useUpdateTemplateRiskAnalysis,
  useDeleteTemplateRiskAnalysis,
}
