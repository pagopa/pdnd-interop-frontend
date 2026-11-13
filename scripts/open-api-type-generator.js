import { generateApi } from 'swagger-typescript-api'
import path from 'path'

const openApiSpecificationFileUrl =
  'https://raw.githubusercontent.com/pagopa/interop-be-monorepo/c1e2effa5ba531f6f6784ff84534dbba8b5f3abf/packages/api-clients/open-api/bffApi.yml'
const apiFolderPath = path.resolve('./src/api/')

generateApi({
  fileName: 'api.generatedTypes.ts',
  url: openApiSpecificationFileUrl,
  output: apiFolderPath,
  generateClient: false,
  generateUnionEnums: true,
  extractRequestParams: true,
  extractRequestBody: true,
  generateRouteTypes: true,
}).catch((e) => console.error(e))
