import axiosInstance from '@/config/axios'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'

async function getProviderTemplatesList() {
  //TODO params: GetProducerTemplatesParams
  /*const response = await axiosInstance.get<EServiceTemplates>(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/templates`,
    { params }
  )
  return response.data*/
  const response = {
    id: 'mock_templateid',
    name: 'mock_tamplatename',
    versione: '1',
    status: 'attivo',
  }
  return response
}

async function getSingle(eserviceTemplateId: string) {
  /*const response = await axiosInstance.get<EServiceTemplate>(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/templates//${eServiceTemplateId}`
  )
  return response.data*/
  return []
}

export const TemplateServices = {
  getProviderTemplatesList,
  getSingle,
}
