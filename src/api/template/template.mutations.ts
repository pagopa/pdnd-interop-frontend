import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { TemplateServices } from './template.services'
import type {
  EServiceTemplateRiskAnalysisSeed,
  UpdateEServiceTemplateVersionSeed,
} from '../api.generatedTypes'
import { AttributeKey } from '@/types/attribute.types'

function useUpdateEServiceTemplateName() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'eserviceTemplate.updateEServiceTemplateName',
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

function useUpdateEServiceTemplateIntendedTarget() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'eserviceTemplate.updateEServiceTemplateAudience',
  })
  return useMutation({
    mutationFn: TemplateServices.updateEServiceTemplateIntendedTarget,
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useUpdateEServiceTemplateDescription() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'eserviceTemplate.updateEServiceDescription',
  })
  return useMutation({
    mutationFn: TemplateServices.updateEServiceTemplateDescription,
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useUpdateQuotas() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'eserviceTemplate.updateVersion',
  })
  return useMutation({
    mutationFn: TemplateServices.updateEServiceTemplateQuotas,
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function usePostVersionDraftDocument() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'eserviceTemplate.postVersionDraftDocument',
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
    keyPrefix: 'eserviceTemplate.deleteVersionDraftDocument',
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
    keyPrefix: 'eserviceTemplate.updateVersionDraftDocumentDescription',
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
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'eserviceTemplate.createDraft' })
  return useMutation({
    mutationFn: TemplateServices.createDraft,
    meta: {
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useCreateNewVersionDraft() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'eserviceTemplate.createNewVersionDraft',
  })
  return useMutation({
    mutationFn: TemplateServices.createNewVersionDraft,
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
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'eserviceTemplate.updateDraft' })
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
    keyPrefix: 'eserviceTemplate.updateVersionDraft',
  })
  return useMutation({
    mutationFn: (
      payload: {
        eServiceTemplateId: string
        eServiceTemplateVersionId: string
      } & UpdateEServiceTemplateVersionSeed
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
    keyPrefix: 'eserviceTemplate.addEServiceTemplateRiskAnalysis',
  })
  return useMutation({
    mutationFn: (
      payload: {
        eServiceTemplateId: string
      } & EServiceTemplateRiskAnalysisSeed
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
    keyPrefix: 'eserviceTemplate.updateEServiceTemplateRiskAnalysis',
  })
  return useMutation({
    mutationFn: (
      payload: {
        eServiceTemplateId: string
        riskAnalysisId: string
      } & EServiceTemplateRiskAnalysisSeed
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
    keyPrefix: 'eserviceTemplate.deleteEServiceTemplateRiskAnalysis',
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

function useUpdateAttributes() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'eserviceTemplate.updateDescriptorAttributes',
  })
  const { t: tAttribute } = useTranslation('attribute', { keyPrefix: 'type' })
  return useMutation({
    mutationFn: TemplateServices.updateAttributes,
    meta: {
      successToastLabel: (_: unknown, variables: unknown) =>
        t('outcome.success', {
          attributeKind: tAttribute(
            `${(variables as { attributeKey: AttributeKey }).attributeKey}_other`
          ),
        }),
      errorToastLabel: (_: unknown, variables: unknown) =>
        t('outcome.error', {
          attributeKind: tAttribute(
            `${(variables as { attributeKey: AttributeKey }).attributeKey}_other`
          ),
        }),
      loadingLabel: t('loading'),
    },
  })
}

function usePublishVersionDraft() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'eserviceTemplate.publishVersionDraft',
  })
  return useMutation({
    mutationFn: ({
      eServiceTemplateId,
      eServiceTemplateVersionId,
    }: {
      eServiceTemplateId: string
      eServiceTemplateVersionId: string
    }) => TemplateServices.publishVersionDraft({ eServiceTemplateId, eServiceTemplateVersionId }),
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
      confirmationDialog: {
        title: t('confirmDialog.title'),
        description: t('confirmDialog.description'),
        proceedLabel: undefined,
      },
    },
  })
}

function useDeleteVersionDraft() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'eserviceTemplate.deleteVersionDraft',
  })
  return useMutation({
    mutationFn: TemplateServices.deleteVersionDraft,
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
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'eserviceTemplate.suspendVersion',
  })
  return useMutation({
    mutationFn: TemplateServices.suspendVersion,
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
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'eserviceTemplate.reactivateVersion',
  })
  return useMutation({
    mutationFn: TemplateServices.reactivateVersion,
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

function useCreateInstanceFromEServiceTemplate() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'eserviceTemplate.createDraft' })
  return useMutation({
    mutationFn: TemplateServices.createInstanceFromEServiceTemplate,
    meta: {
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

export const TemplateMutations = {
  useUpdateEServiceTemplateName,
  useUpdateEServiceTemplateIntendedTarget,
  useUpdateEServiceTemplateDescription,
  useUpdateQuotas,
  usePostVersionDraftDocument,
  useDeleteVersionDraftDocument,
  useUpdateVersionDraftDocumentDescription,
  useCreateDraft,
  useCreateNewVersionDraft,
  useUpdateDraft,
  useUpdateVersionDraft,
  useAddTemplateRiskAnalysis,
  useUpdateTemplateRiskAnalysis,
  useDeleteTemplateRiskAnalysis,
  useUpdateAttributes,
  usePublishVersionDraft,
  useDeleteVersionDraft,
  useSuspendVersion,
  useReactivateVersion,
  useCreateInstanceFromEServiceTemplate,
}
