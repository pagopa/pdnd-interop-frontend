import axiosInstance from '@/config/axios'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'

async function getProviderTemplatesList() {
  //TODO params: GetProducerTemplatesParams
  /*const response = await axiosInstance.get<EServiceTemplates>(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/templates`,
    { params }
  )
  return response.data*/
  const response = [
    {
      id: 'mock_templateid1',
      name: 'mock_templatename1',
      version: '1',
      state: 'ACTIVE',
    },
    { id: 'mock_templateid2', name: 'mock_templatename2', version: '1', state: 'DRAFT' },
  ]
  return response
}

async function getSingle(eserviceTemplateId: string) {
  /*const response = await axiosInstance.get<EServiceTemplate>(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/templates//${eServiceTemplateId}`
  )
  return response.data*/
  return {
    id: 'mock_templateid1',
    name: 'mock_templatename1',
    versions: [
      {
        id: '1',
        version: '1',
        description: 'mock_versionDescription1',
        state: 'active',
        voucherLifespan: 600,
        dailyCallsPerConsumer: 10,
        dailyCallsTotal: 100,
      },
    ],
    state: 'ACTIVE',
    eserviceDescription: 'mock_description1',
    audienceDescription:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum efficitur viverra egestas. Aenean mollis libero sit amet leo dignissim, vel elementum libero iaculis. Praesent tempus ex et iaculis ultrices. Maecenas faucibus, neque quis vulputate iaculis, purus lacus.',
    creatorId: 'SFDGVDVDGF',
    technology: 'REST',
    mode: 'RECEIVE',
    isSignalHubEnabled: false,
    attributes: [
      {
        certified: [''],
        verified: [''],
        declared: [''],
      },
    ],
  }
}

async function updateEServiceTemplateName({
  eserviceTemplateId,
  ...payload
}: { eserviceTemplateId: string } & EServiceTempalteNameUpdateSeed) {
  /*const response = await axiosInstance.post(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/templates/${eserviceTemplateId}/name/update`,
    payload
  )
  return response.data*/
  return console.log('name template updated')
}

export const TemplateServices = {
  getProviderTemplatesList,
  getSingle,
  updateEServiceTemplateName,
}
