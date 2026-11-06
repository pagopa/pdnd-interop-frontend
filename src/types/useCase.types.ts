import type { CatalogEService } from '@/api/api.generatedTypes'

export const USE_CASE_FIELD_LABELS = {
  CITIZEN_SERVICES: { it: 'Servizi al cittadino', en: 'Citizen Services' },
  WELFARE: { it: 'Welfare', en: 'Welfare' },
  MOBILITY: { it: 'Mobilità e Trasporti', en: 'Mobility and Transport' },
  EDUCATION: { it: 'Istruzione', en: 'Education' },
  HEALTHCARE: { it: 'Sanità', en: 'Healthcare' },
} as const

export type UseCaseFieldKey = keyof typeof USE_CASE_FIELD_LABELS
export type UseCaseFieldIt = (typeof USE_CASE_FIELD_LABELS)[UseCaseFieldKey]['it']
export type UseCaseFieldEn = (typeof USE_CASE_FIELD_LABELS)[UseCaseFieldKey]['en']
export type UseCaseField = UseCaseFieldIt | UseCaseFieldEn

export type UseCase = {
  name: string
  description: string
  slug: string
  field: UseCaseField
  unsubscribedEServices: CatalogEService[]
  subscribedEServices: CatalogEService[]
}
