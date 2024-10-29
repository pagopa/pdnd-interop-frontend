import { generateApi } from 'swagger-typescript-api'
import path from 'path'

const openApiSpecificationFileUrl =
  'https://raw.githubusercontent.com/pagopa/interop-be-monorepo/refs/heads/feature/delegation-process/packages/api-clients/open-api/bffApi.yml'

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
