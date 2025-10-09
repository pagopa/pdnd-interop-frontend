import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import type {
  EServiceRiskAnalysisSeed,
  UpdateEServiceDescriptorSeed,
  UpdateEServiceDescriptorTemplateInstanceSeed,
} from '../api.generatedTypes'
import { EServiceServices } from './eservice.services'
import { EServiceQueries } from './eservice.queries'
import type { AttributeKey } from '@/types/attribute.types'

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
    mutationFn: EServiceServices.createVersionDraft,
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

function usePublishVersionDraft({ isByDelegation }: { isByDelegation?: boolean }) {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: isByDelegation
      ? 'eservice.publishDelegatedVersionDraft'
      : 'eservice.publishVersionDraft',
  })
  return useMutation({
    mutationFn: ({
      eserviceId,
      descriptorId,
    }: {
      delegatorName?: string
      eserviceName?: string
      eserviceId: string
      descriptorId: string
    }) => EServiceServices.publishVersionDraft({ eserviceId, descriptorId }),
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
      confirmationDialog: {
        title: t('confirmDialog.title'),
        description: isByDelegation
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (variables: any) => {
              return t('confirmDialog.description', {
                delegatorName: variables.delegatorName,
                eserviceName: variables.eserviceName,
              })
            }
          : () => t('confirmDialog.description'),
        proceedLabel: isByDelegation ? t('confirmDialog.actions.proceed') : undefined,
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

function useUpdateInstanceVersion() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'eservice.updateVersion' })
  return useMutation({
    mutationFn: EServiceServices.updateInstanceVersion,
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useUpdateAgreementApprovalPolicy() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'eservice.updateAgreementApprovalPolicy',
  })
  return useMutation({
    mutationFn: EServiceServices.updateAgreementApprovalPolicy,
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

function useUpdateEServiceDescription() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'eservice.updateEServiceDescription',
  })
  return useMutation({
    mutationFn: EServiceServices.updateEServiceDescription,
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useUpdateDescriptorAttributes() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'eservice.updateDescriptorAttributes',
  })
  const { t: tAttribute } = useTranslation('attribute', { keyPrefix: 'type' })
  return useMutation({
    mutationFn: EServiceServices.updateDescriptorAttributes,
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

function useApproveDelegatedVersionDraft() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'eservice.approveDelegatedVersionDraft',
  })
  return useMutation({
    mutationFn: EServiceServices.approveDelegatedVersionDraft,
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useRejectDelegatedVersionDraft() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'eservice.rejectDelegatedVersionDraft',
  })
  return useMutation({
    mutationFn: EServiceServices.rejectDelegatedVersionDraft,
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useUpdateEServiceName() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'eservice.updateEServiceName',
  })
  return useMutation({
    mutationFn: EServiceServices.updateEServiceName,
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useDeleteAndUpdateEServiceInterfaceRESTInfo() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'eservice.updateEServiceInterfaceInfo',
  })
  return useMutation({
    mutationFn: EServiceServices.deleteDocAndUpdateEServiceInterfaceRESTInfo,
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useDeleteAndUpdateEServiceInterfaceSOAPInfo() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'eservice.updateEServiceInterfaceInfo',
  })
  return useMutation({
    mutationFn: EServiceServices.deleteDocAndUpdateEServiceInterfaceSOAPInfo,
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useUpgradeEService() {
  return useMutation({
    mutationFn: EServiceServices.upgradeEService,
  })
}

function useUpdateInstanceVersionDraft(config = { suppressSuccessToast: false }) {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'eservice.updateVersionDraft',
  })
  return useMutation({
    mutationFn: (
      payload: {
        eserviceId: string
        descriptorId: string
      } & UpdateEServiceDescriptorTemplateInstanceSeed
    ) => EServiceServices.updateInstanceVersionDraft(payload),
    meta: {
      successToastLabel: config.suppressSuccessToast ? undefined : t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useDeleteDraftAndUpgradeEService() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'eservice.deleteAndUpgradeEService',
  })
  return useMutation({
    mutationFn: EServiceServices.deleteDraftAndUpgradeEService,
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

function useUpdateEServiceSignalHub() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'eservice.updateEServiceIsSignalHubEnabled',
  })
  return useMutation({
    mutationFn: EServiceServices.updateEServiceSignalHub,
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useUpdateEServicePersonalDataFlagAfterPublication() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'eservice.updateEServicePersonalDataFlagAfterPublication',
  })
  return useMutation({
    mutationFn: EServiceServices.updateEServicePersonalDataFlagAfterPublication,
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
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
  useUpdateEServiceDescription,
  useUpdateVersionDraftDocumentDescription,
  useImportVersion,
  useUpdateDescriptorAttributes,
  useApproveDelegatedVersionDraft,
  useRejectDelegatedVersionDraft,
  useUpdateEServiceName,
  useDeleteAndUpdateEServiceInterfaceRESTInfo,
  useDeleteAndUpdateEServiceInterfaceSOAPInfo,
  useUpgradeEService,
  useUpdateInstanceVersionDraft,
  useDeleteDraftAndUpgradeEService,
  useUpdateInstanceVersion,
  useUpdateAgreementApprovalPolicy,
  useUpdateEServiceSignalHub,
  useUpdateEServicePersonalDataFlagAfterPublication,
}
