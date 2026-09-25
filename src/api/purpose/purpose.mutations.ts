import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { PurposeServices } from './purpose.services'
function useCreateDraft() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'purpose.createDraft' })
  return useMutation({
    mutationFn: PurposeServices.createDraft,
    meta: {
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useUpdateDraft() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'purpose.updateDraft' })
  return useMutation({
    mutationFn: PurposeServices.updateDraft,
    meta: {
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useUpdateDraftFromPurposeTemplate() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'purpose.updateDraft',
  })
  return useMutation({
    mutationFn: PurposeServices.updateDraftFromPurposeTemplate,
    meta: {
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useDeleteDraft() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'purpose.deleteDraft' })
  return useMutation({
    mutationFn: PurposeServices.deleteDraft,
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

function useCreateDraftForReceiveEService() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'purpose.createDraftForReceiveEService',
  })
  return useMutation({
    mutationFn: PurposeServices.createDraftForReceiveEService,
    meta: {
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useUpdateDraftForReceiveEService() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'purpose.updateDraft',
  })
  return useMutation({
    mutationFn: PurposeServices.updateDraftForReceiveEService,
    meta: {
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useUpdateDailyCalls() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'purpose.updateDailyCalls',
  })
  return useMutation({
    mutationFn: PurposeServices.updateDailyCalls,
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useSuspendVersion() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'purpose.suspendVersion' })
  return useMutation({
    mutationFn: PurposeServices.suspendVersion,
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

function useActivateVersion() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'purpose.activateVersion' })
  return useMutation({
    mutationFn: PurposeServices.activateVersion,
    meta: {
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
      confirmationDialog: {
        title: t('confirmDialog.title'),
        description: t('confirmDialog.description'),
        proceedLabel: t('confirmDialog.proceedLabel'),
      },
    },
  })
}

function useArchiveVersion() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'purpose.archiveVersion' })
  return useMutation({
    mutationFn: PurposeServices.archiveVersion,
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

function useDeleteVersion() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'purpose.deleteVersion' })
  return useMutation({
    mutationFn: PurposeServices.deleteVersion,
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

function useRejectVersion() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'purpose.rejectVersion' })
  return useMutation({
    mutationFn: PurposeServices.rejectVersion,
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useClone() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'purpose.clone' })
  return useMutation({
    mutationFn: PurposeServices.clone,
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useAddClient() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'purpose.addClient' })
  return useMutation({
    mutationFn: PurposeServices.addClient,
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useRemoveClient() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'purpose.removeClient' })
  return useMutation({
    mutationFn: PurposeServices.removeClient,
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

function useCreateDraftFromPurposeTemplate() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'purpose.createDraft' })
  return useMutation({
    mutationFn: PurposeServices.createDraftFromPurposeTemplate,
    meta: {
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

/**
 * Feedback variant for the risk analysis assignment mutation:
 *  - `none`: first assignment in the self-compilation modes, which give no success feedback
 *  - `create`: first assignment in the reviewer-compilation mode
 *  - `edit`: any change to an assignment that already exists
 */
export type AssignRiskAnalysisReviewerFeedback = 'none' | 'create' | 'edit'

function useAssignRiskAnalysisReviewer({
  feedback,
}: {
  feedback: AssignRiskAnalysisReviewerFeedback
}) {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'purpose' })

  const labels =
    feedback === 'edit'
      ? {
          success: t('updateRiskAnalysisAssignment.outcome.success'),
          error: t('updateRiskAnalysisAssignment.outcome.error'),
          loading: t('updateRiskAnalysisAssignment.loading'),
        }
      : {
          success: t('assignRiskAnalysisReviewer.outcome.success'),
          error: t('assignRiskAnalysisReviewer.outcome.error'),
          loading: t('assignRiskAnalysisReviewer.loading'),
        }

  return useMutation({
    mutationFn: PurposeServices.assignRiskAnalysisReviewer,
    meta: {
      successToastLabel: feedback === 'none' ? undefined : labels.success,
      errorToastLabel: labels.error,
      loadingLabel: labels.loading,
    },
  })
}

function useSubmitRiskAnalysis() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'purpose.submitRiskAnalysis',
  })
  return useMutation({
    mutationFn: PurposeServices.submitRiskAnalysis,
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useSignRiskAnalysis() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'purpose.signRiskAnalysis' })
  return useMutation({
    mutationFn: PurposeServices.signRiskAnalysis,
    meta: {
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useRejectRiskAnalysis() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'purpose.rejectRiskAnalysis' })
  return useMutation({
    mutationFn: PurposeServices.rejectRiskAnalysis,
    meta: {
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useUpdateRiskAnalysis() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'purpose.updateRiskAnalysis' })
  return useMutation({
    mutationFn: PurposeServices.updateRiskAnalysis,
    meta: {
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

export const PurposeMutations = {
  useCreateDraft,
  useUpdateDraft,
  useUpdateDraftFromPurposeTemplate,
  useDeleteDraft,
  useCreateDraftForReceiveEService,
  useUpdateDraftForReceiveEService,
  useUpdateDailyCalls,
  useSuspendVersion,
  useActivateVersion,
  useArchiveVersion,
  useDeleteVersion,
  useRejectVersion,
  useClone,
  useAddClient,
  useRemoveClient,
  useCreateDraftFromPurposeTemplate,
  useAssignRiskAnalysisReviewer,
  useSubmitRiskAnalysis,
  useSignRiskAnalysis,
  useRejectRiskAnalysis,
  useUpdateRiskAnalysis,
}
