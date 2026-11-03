import type { RiskAnalysisFormSeed } from '@/api/api.generatedTypes'
import { create } from 'zustand'

type PendingRiskAnalysisReview = {
  purposeId: string
  previousMetadataVersion: number | undefined
  riskAnalysisForm: RiskAnalysisFormSeed
}

type RiskAnalysisReviewState = {
  pendingReview: PendingRiskAnalysisReview | undefined
  setPendingReview: (review: PendingRiskAnalysisReview | undefined) => void
}

// A browser reload starts an explicit new review; pending saves must not survive it.
export const useRiskAnalysisReviewStore = create<RiskAnalysisReviewState>((set) => ({
  pendingReview: undefined,
  setPendingReview: (pendingReview) => set({ pendingReview }),
}))
