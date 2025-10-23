import { generateApi } from 'swagger-typescript-api'
import path from 'path'

// const openApiSpecificationFileUrl =
// 'https://raw.githubusercontent.com/pagopa/interop-be-monorepo/refs/heads/develop/packages/api-clients/open-api/bffApi.yml'

//FIXME: remove this before merge
const openApiSpecificationFileUrl =
  'https://raw.githubusercontent.com/pagopa/interop-be-monorepo/460df69fc16c208e1bcf2fb5f529cad59ad2cdc6/packages/api-clients/open-api/bffApi.yml'

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
