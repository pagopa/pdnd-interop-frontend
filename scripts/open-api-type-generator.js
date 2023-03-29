import { generateApi } from 'swagger-typescript-api'
import path from 'path'
import { writeFile } from 'fs'

const openApiSpecificationFileUrl =
  'https://raw.githubusercontent.com/pagopa/interop-be-backend-for-frontend/1.0.x/src/main/resources/interface-specification.yml'

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
})
  .then(({ files }) => {
    files.forEach(({ content }) => {
      writeFile(path, content)
    })
  })
  .catch((e) => console.error(e))
