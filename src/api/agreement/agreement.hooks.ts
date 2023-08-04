import { type UseQueryOptions, useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useDownloadFile } from '../hooks/useDownloadFile'
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

function useGetList(params: GetAgreementsParams, config: UseQueryOptions<Agreements>) {
  return useQuery({
    queryKey: [AgreementQueryKeys.GetList, params],
    queryFn: () => AgreementServices.getList(params),
    ...config,
  })
}

function useGetSingle(agreementId: string, config?: UseQueryOptions<Agreement>) {
  return useQuery({
    queryKey: [AgreementQueryKeys.GetSingle, agreementId],
    queryFn: () => AgreementServices.getSingle(agreementId),
    ...config,
  })
}

function useGetProducers(
  params: GetAgreementProducersParams,
  config?: UseQueryOptions<CompactOrganizations>
) {
  return useQuery({
    queryKey: [AgreementQueryKeys.GetProducers, params],
    queryFn: () => AgreementServices.getProducers(params),
    ...config,
  })
}

function useGetConsumers(
  params: GetAgreementConsumersParams,
  config?: UseQueryOptions<CompactOrganizations>
) {
  return useQuery({
    queryKey: [AgreementQueryKeys.GetConsumers, params],
    queryFn: () => AgreementServices.getConsumers(params),
    ...config,
  })
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
  config: UseQueryOptions<CompactEServicesLight>
) {
  return useQuery({
    queryKey: [AgreementQueryKeys.GetProducerEServiceList, params],
    queryFn: () => AgreementServices.getProducerEServiceList(params),
    ...config,
  })
}

function useGetConsumerEServiceList(
  params: GetAgreementEServiceConsumersParams,
  config: UseQueryOptions<CompactEServicesLight>
) {
  return useQuery({
    queryKey: [AgreementQueryKeys.GetConsumerEServiceList, params],
    queryFn: () => AgreementServices.getConsumerEServiceList(params),
    ...config,
  })
}

function useCreateDraft() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'agreement.createDraft' })
  return useMutation(
    ({
      eserviceId,
      descriptorId,
    }: {
      eserviceName: string
      eserviceVersion: string | undefined
    } & AgreementPayload) => AgreementServices.createDraft({ eserviceId, descriptorId }),
    {
      meta: {
        errorToastLabel: t('outcome.error'),
        loadingLabel: t('loading'),
        confirmationDialog: {
          title: t('confirmDialog.title'),
          // For now the react-query TVariables generic is not being inferred.
          // This will be fixed in this pr: https://github.com/TanStack/query/pull/5804
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          description: ({ eserviceName, eserviceVersion }: any) =>
            t('confirmDialog.description', { name: eserviceName, version: eserviceVersion }),
          proceedLabel: t('confirmDialog.proceedLabel'),
        },
      },
    }
  )
}

function useSubmitDraft() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'agreement.submitDraft' })
  return useMutation(AgreementServices.submitDraft, {
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

function useSubmitToOwnEService() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'agreement.submitToOwnEService',
  })
  return useMutation(AgreementServices.submitToOwnEService, {
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
  return useMutation(AgreementServices.deleteDraft, {
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
  return useMutation(AgreementServices.updateDraft, {
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
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
  return useMutation(AgreementServices.uploadDraftDocument, {
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
  return useMutation(AgreementServices.deleteDraftDocument, {
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useActivate() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'agreement.activate' })
  return useMutation(AgreementServices.activate, {
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
  return useMutation(AgreementServices.reject, {
    meta: {
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useClone() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'agreement.clone' })
  return useMutation(AgreementServices.clone, {
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
  return useMutation(AgreementServices.suspend, {
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
  return useMutation(AgreementServices.archive, {
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
  return useMutation(AgreementServices.upgrade, {
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
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
  useArchive,
  useUpgrade,
  useClone,
}

export const AgreementDownloads = {
  useDownloadDocument,
  useDownloadContract,
}
