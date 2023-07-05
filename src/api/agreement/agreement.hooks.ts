import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useMutationWrapper, useQueryWrapper } from '../react-query-wrappers'
import type { UseQueryWrapperOptions } from '../react-query-wrappers/react-query-wrappers.types'
import { useDownloadFile } from '../react-query-wrappers/useDownloadFile'
import AgreementServices from './agreement.services'
import type {
  Agreement,
  AgreementPayload,
  Agreements,
  CompactEServicesLight,
  CompactOrganizations,
  GetAgreementConsumersParams,
  GetAgreementEServiceConsumersParams,
  GetAgreementEServiceProducersParams,
  GetAgreementProducersParams,
  GetAgreementsParams,
} from '../api.generatedTypes'

export enum AgreementQueryKeys {
  GetList = 'AgreementGetList',
  GetSingle = 'AgreementGetSingle',
  GetProducers = 'AgreementGetProducers',
  GetConsumers = 'AgreementGetConsumers',
  GetProducerEServiceList = 'AgreementGetProducerEServiceList',
  GetConsumerEServiceList = 'AgreementGetConsumerEServiceList',
}

function useGetList(params: GetAgreementsParams, config: UseQueryWrapperOptions<Agreements>) {
  return useQueryWrapper(
    [AgreementQueryKeys.GetList, params],
    () => AgreementServices.getList(params),
    config
  )
}

function useGetSingle(agreementId: string, config?: UseQueryWrapperOptions<Agreement>) {
  return useQueryWrapper(
    [AgreementQueryKeys.GetSingle, agreementId],
    () => AgreementServices.getSingle(agreementId),
    config
  )
}

function useGetProducers(
  params: GetAgreementProducersParams,
  config?: UseQueryWrapperOptions<CompactOrganizations>
) {
  return useQueryWrapper(
    [AgreementQueryKeys.GetProducers, params],
    () => AgreementServices.getProducers(params),
    config
  )
}

function useGetConsumers(
  params: GetAgreementConsumersParams,
  config?: UseQueryWrapperOptions<CompactOrganizations>
) {
  return useQueryWrapper(
    [AgreementQueryKeys.GetConsumers, params],
    () => AgreementServices.getConsumers(params),
    config
  )
}

function usePrefetchSingle() {
  const queryClient = useQueryClient()
  return (agreementId: string) =>
    queryClient.prefetchQuery([AgreementQueryKeys.GetSingle, agreementId], () =>
      AgreementServices.getSingle(agreementId)
    )
}

function useGetProducerEServiceList(
  params: GetAgreementEServiceProducersParams,
  config: UseQueryWrapperOptions<CompactEServicesLight>
) {
  return useQueryWrapper(
    [AgreementQueryKeys.GetProducerEServiceList, params],
    () => AgreementServices.getProducerEServiceList(params),
    config
  )
}

function useGetConsumerEServiceList(
  params: GetAgreementEServiceConsumersParams,
  config: UseQueryWrapperOptions<CompactEServicesLight>
) {
  return useQueryWrapper(
    [AgreementQueryKeys.GetConsumerEServiceList, params],
    () => AgreementServices.getConsumerEServiceList(params),
    config
  )
}

function useCreateDraft() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'agreement.createDraft' })
  return useMutationWrapper(
    ({
      eserviceId,
      descriptorId,
    }: {
      eserviceName: string
      eserviceVersion: string | undefined
    } & AgreementPayload) => AgreementServices.createDraft({ eserviceId, descriptorId }),
    {
      suppressSuccessToast: true,
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
      showConfirmationDialog: true,
      dialogConfig: {
        title: t('confirmDialog.title'),
        description: ({ eserviceName, eserviceVersion }) =>
          t('confirmDialog.description', { name: eserviceName, version: eserviceVersion }),
        proceedLabel: t('confirmDialog.proceedLabel'),
      },
    }
  )
}

function useSubmitDraft() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'agreement.submitDraft' })
  return useMutationWrapper(AgreementServices.submitDraft, {
    successToastLabel: t('outcome.success'),
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
    showConfirmationDialog: true,
    dialogConfig: {
      title: t('confirmDialog.title'),
      description: t('confirmDialog.description'),
    },
  })
}

function useSubmitToOwnEService() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'agreement.submitToOwnEService',
  })
  return useMutationWrapper(AgreementServices.submitToOwnEService, {
    successToastLabel: t('outcome.success'),
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
    showConfirmationDialog: true,
    dialogConfig: {
      title: t('confirmDialog.title'),
      description: t('confirmDialog.description'),
    },
  })
}

function useDeleteDraft() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'agreement.deleteDraft' })
  return useMutationWrapper(AgreementServices.deleteDraft, {
    successToastLabel: t('outcome.success'),
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
    showConfirmationDialog: true,
    dialogConfig: {
      title: t('confirmDialog.title'),
      description: t('confirmDialog.description'),
    },
  })
}

function useUpdateDraft() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'agreement.updateDraft' })
  return useMutationWrapper(AgreementServices.updateDraft, {
    successToastLabel: t('outcome.success'),
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
  })
}

function useDownloadDocument() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'agreement.downloadDraftDocument',
  })
  return useDownloadFile(AgreementServices.downloadDraftDocument, {
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
  })
}

function useUploadDraftDocument() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'agreement.uploadDraftDocument',
  })
  return useMutationWrapper(AgreementServices.uploadDraftDocument, {
    suppressSuccessToast: true,
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
  })
}

function useDeleteDraftDocument() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'agreement.deleteDraftDocument',
  })
  return useMutationWrapper(AgreementServices.deleteDraftDocument, {
    successToastLabel: t('outcome.success'),
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
  })
}

function useActivate() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'agreement.activate' })
  return useMutationWrapper(AgreementServices.activate, {
    successToastLabel: t('outcome.success'),
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
    showConfirmationDialog: true,
    dialogConfig: {
      title: t('confirmDialog.title'),
      description: t('confirmDialog.description'),
    },
  })
}

function useReject() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'agreement.reject' })
  return useMutationWrapper(AgreementServices.reject, {
    suppressSuccessToast: true,
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
  })
}

function useClone() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'agreement.clone' })
  return useMutationWrapper(AgreementServices.clone, {
    successToastLabel: t('outcome.success'),
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
    showConfirmationDialog: true,
    dialogConfig: {
      title: t('confirmDialog.title'),
      description: t('confirmDialog.description'),
    },
  })
}

function useSuspend() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'agreement.suspend' })
  return useMutationWrapper(AgreementServices.suspend, {
    successToastLabel: t('outcome.success'),
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
    showConfirmationDialog: true,
    dialogConfig: {
      title: t('confirmDialog.title'),
      description: t('confirmDialog.description'),
    },
  })
}

function useUpgrade() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'agreement.upgrade' })
  return useMutationWrapper(AgreementServices.upgrade, {
    successToastLabel: t('outcome.success'),
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
    showConfirmationDialog: true,
    dialogConfig: {
      title: t('confirmDialog.title'),
      description: t('confirmDialog.description'),
    },
  })
}

function useDownloadContract() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'agreement.downloadContract',
  })
  return useDownloadFile(AgreementServices.downloadContract, {
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
  })
}

export const AgreementQueries = {
  useGetList,
  useGetSingle,
  usePrefetchSingle,
  useGetProducers,
  useGetConsumers,
  useGetProducerEServiceList,
  useGetConsumerEServiceList,
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
  useUpgrade,
  useClone,
}

export const AgreementDownloads = {
  useDownloadDocument,
  useDownloadContract,
}
