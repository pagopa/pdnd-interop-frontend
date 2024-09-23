import { generateApi } from 'swagger-typescript-api'
import path from 'path'

// const openApiSpecificationFileUrl =
//   'https://raw.githubusercontent.com/pagopa/interop-be-backend-for-frontend/1.0.x/src/main/resources/interface-specification.yml'

// TODO remove this and decomment the line below
const openApiSpecificationFileUrl =
  'https://raw.githubusercontent.com/pagopa/interop-be-monorepo/main/packages/api-clients/open-api/bffApi.yml'

const apiFolderPath = path.resolve('./src/api/')

generateApi({
  name: 'api.generatedTypes.ts',
  url: openApiSpecificationFileUrl,
  output: apiFolderPath,
  generateClient: false,
  generateUnionEnums: true,
  extractRequestParams: true,
  extractRequestBody: true,
  generateRouteTypes: true,
}).catch((e) => console.error(e))
