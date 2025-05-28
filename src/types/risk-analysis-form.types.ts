import type { FormConfigQuestion } from '@/api/api.generatedTypes'

export type RiskAnalysisAnswerValue = string | Array<string> | boolean
export type RiskAnalysisQuestions = Record<string, FormConfigQuestion>
export type RiskAnalysisAnswers = Record<string, RiskAnalysisAnswerValue>
export type RiskAnalysisKind = 'PA' | 'PRIVATE'
