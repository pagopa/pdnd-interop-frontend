import type { FormConfigQuestion } from '@/api/api.generatedTypes'

export type AnswerValue = string | Array<string> | boolean
export type Questions = Record<string, FormConfigQuestion>
export type Answers = Record<string, AnswerValue>
