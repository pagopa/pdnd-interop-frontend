import type { RiskAnalysisSigningState } from '@/api/api.generatedTypes'

export type ConcludedSigningState = Extract<RiskAnalysisSigningState, 'SIGNED' | 'REJECTED'>
