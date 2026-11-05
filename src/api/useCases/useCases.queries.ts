import { queryOptions } from '@tanstack/react-query'
import { UseCasesServices } from './useCases.services'
import type { LangCode } from '@/types/common.types'

function getUseCasesJson(lang: LangCode) {
  return queryOptions({
    queryKey: ['GetUseCasesJson'],
    queryFn: () => UseCasesServices.getUseCasesJson(lang),
  })
}

export const UseCasesQueries = {
  getUseCasesJson,
}
