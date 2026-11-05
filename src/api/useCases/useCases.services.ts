import { APP_MODE, INTEROP_RESOURCES_BASE_URL } from '@/config/env'
import type { LangCode } from '@/types/common.types'
import type { UseCase } from '@/types/useCase.types'
import axios from 'axios'

async function getUseCasesJson(lang: LangCode) {
  // TODO Mock data in development to avoid CORS issues with S3
  if (APP_MODE === 'development') {
    const useCases: Array<UseCase> = [
      {
        name: 'TODO',
        field: 'Servizi al cittadino',
        eserviceIds: [],
        slug: 'goToapi.gov',
        description: 'Description',
      },
    ]

    return useCases
  }

  const response = await axios.get<Array<UseCase>>(
    `${INTEROP_RESOURCES_BASE_URL}/use-cases/data-${lang}.json` // TODO get the right path and file name based on lang
  )
  return response.data
}

export const UseCasesServices = {
  getUseCasesJson,
}
