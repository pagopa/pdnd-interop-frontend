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
  // httpClientType: 'axios',
  generateClient: false,
  // singleHttpClient: undefined,
  generateUnionEnums: true,
  extractRequestParams: true,
  extractRequestBody: true,
  generateRouteTypes: true,
  // hooks: {
  //   onCreateRoute: (routeData) => {
  //     if (routeData.request.pathParams) console.log(routeData)
  //   },
  // },
})
  .then(({ files, configuration }) => {
    files.forEach(({ content, name }) => {
      writeFile(path, content)
    })
  })
  .catch((e) => console.error(e))
