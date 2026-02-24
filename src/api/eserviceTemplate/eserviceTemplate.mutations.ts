import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { AxiosError } from 'axios'
import { EServiceTemplateServices } from './eserviceTemplate.services'
import type {
  EServiceTemplateRiskAnalysisSeed,
  UpdateEServiceTemplateVersionSeed,
} from '../api.generatedTypes'
import type { AttributeKey } from '@/types/attribute.types'

export const DUPLICATE_INSTANCE_LABEL_ERROR_CODE = '007'

function useUpdateEServiceTemplateName() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'eserviceTemplate.updateEServiceTemplateName',
  })
  return useMutation({
    mutationFn: EServiceTemplateServices.updateEServiceTemplateName,
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
    mutationFn: EServiceTemplateServices.updateEServiceTemplateIntendedTarget,
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
    mutationFn: EServiceTemplateServices.updateEServiceTemplateDescription,
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
    mutationFn: EServiceTemplateServices.updateEServiceTemplateQuotas,
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
    mutationFn: EServiceTemplateServices.postVersionDraftDocument,
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
    mutationFn: EServiceTemplateServices.deleteVersionDraftDocument,
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
    mutationFn: EServiceTemplateServices.updateVersionDraftDocumentDescription,
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
    mutationFn: EServiceTemplateServices.createDraft,
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
    mutationFn: EServiceTemplateServices.createNewVersionDraft,
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
    mutationFn: EServiceTemplateServices.updateDraft,
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
    ) => EServiceTemplateServices.updateVersionDraft(payload),
    meta: {
      successToastLabel: config.suppressSuccessToast ? undefined : t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useAddEServiceTemplateRiskAnalysis(config = { suppressSuccessToast: false }) {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'eserviceTemplate.addEServiceTemplateRiskAnalysis',
  })
  return useMutation({
    mutationFn: (
      payload: {
        eServiceTemplateId: string
      } & EServiceTemplateRiskAnalysisSeed
    ) => EServiceTemplateServices.addEServiceTemplateRiskAnalysis(payload),
    meta: {
      successToastLabel: config.suppressSuccessToast ? undefined : t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useUpdateEServiceTemplateRiskAnalysis(config = { suppressSuccessToast: false }) {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'eserviceTemplate.updateEServiceTemplateRiskAnalysis',
  })
  return useMutation({
    mutationFn: (
      payload: {
        eServiceTemplateId: string
        riskAnalysisId: string
      } & EServiceTemplateRiskAnalysisSeed
    ) => EServiceTemplateServices.updateEServiceTemplateRiskAnalysis(payload),
    meta: {
      successToastLabel: config.suppressSuccessToast ? undefined : t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useDeleteEServiceTemplateRiskAnalysis() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'eserviceTemplate.deleteEServiceTemplateRiskAnalysis',
  })
  return useMutation({
    mutationFn: EServiceTemplateServices.deleteEServiceTemplateRiskAnalysis,
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
    mutationFn: EServiceTemplateServices.updateAttributes,
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
    }) =>
      EServiceTemplateServices.publishVersionDraft({
        eServiceTemplateId,
        eServiceTemplateVersionId,
      }),
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
    mutationFn: EServiceTemplateServices.deleteVersionDraft,
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
    mutationFn: EServiceTemplateServices.suspendVersion,
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
    mutationFn: EServiceTemplateServices.reactivateVersion,
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
    mutationFn: EServiceTemplateServices.createInstanceFromEServiceTemplate,
    meta: {
      errorToastLabel: (error: unknown) => {
        if (
          error instanceof AxiosError &&
          error.response?.data?.errors?.[0]?.code === DUPLICATE_INSTANCE_LABEL_ERROR_CODE
        )
          return ''
        return t('outcome.error')
      },
      loadingLabel: t('loading'),
    },
  })
}

function useUpdateInstanceFromEServiceTemplate() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'eserviceTemplate.createDraft' })
  return useMutation({
    mutationFn: EServiceTemplateServices.updateInstanceFromEServiceTemplate,
    meta: {
      errorToastLabel: (error: unknown) => {
        if (
          error instanceof AxiosError &&
          error.response?.data?.errors?.[0]?.code === DUPLICATE_INSTANCE_LABEL_ERROR_CODE
        )
          return ''
        return t('outcome.error')
      },
      loadingLabel: t('loading'),
    },
  })
}

function useUpdateEServiceTemplatePersonalDataFlagAfterPublication() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'eservice.updateEServiceTemplatePersonalDataFlagAfterPublication',
  })
  return useMutation({
    mutationFn: EServiceTemplateServices.updateEServiceTemplatePersonalDataFlagAfterPublication,
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

export const EServiceTemplateMutations = {
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
  useAddEServiceTemplateRiskAnalysis,
  useUpdateEServiceTemplateRiskAnalysis,
  useDeleteEServiceTemplateRiskAnalysis,
  useUpdateAttributes,
  usePublishVersionDraft,
  useDeleteVersionDraft,
  useSuspendVersion,
  useReactivateVersion,
  useCreateInstanceFromEServiceTemplate,
  useUpdateInstanceFromEServiceTemplate,
  useUpdateEServiceTemplatePersonalDataFlagAfterPublication,
}
