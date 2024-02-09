/**
 * This script generates a session token for the Interop application.
 *
 * Usage:
 * You must be logged in to AWS with the correct permissions and requires the
 * `REMOTE_WELLKNOWN_URL` environment variable to be set.
 *
 * `npm run generate-token [tenant] [role]`
 * where:
 * - [tenant] is the tenant for which to generate the token. Possible values are: GSP, PA1, PA2, PRIVATO. Default is GSP.
 * - [role] is the role for which to generate the token. Possible values are: ADMIN, API, SECURITY, API,SECURITY, SUPPORT. Default is ADMIN.
 *
 * The token will be written to the .env.development.local file in the REACT_APP_MOCK_TOKEN variable.
 *
 * Example:
 * `npm run generate-token PA1 API` // Generates a token for the PA1 tenant with the API role.
 */

import { config as dotenvConfig } from 'dotenv'
import * as http from 'http'
import * as https from 'https'
import { v4 as uuidv4 } from 'uuid'
import _ from 'lodash'
import { VerifyCommand, KMSClient, SignCommand } from '@aws-sdk/client-kms'
import { readFileSync, write, writeFileSync } from 'fs'

const config = {
  kms: {
    kid: null,
    alg: 'RSASSA_PKCS1_V1_5_SHA_256',
  },
}

const kmsClient = new KMSClient()

const SESSION_TOKENS_DURATION_SECONDS = 60 * 60 * 24 // 24 hours
const ENV_FILE_PATH = '.env.development.local'
const ENV_TOKEN_KEY = 'REACT_APP_MOCK_TOKEN'
const ALL_TENANTS = {
  GSP: {
    ADMIN: {
      externalId: {
        origin: 'IPA',
        value: '5N2TR557',
      },
      'user-roles': 'admin',
      selfcareId: '1962d21c-c701-4805-93f6-53a877898756',
      organizationId: '69e2865e-65ab-4e48-a638-2037a9ee2ee7',
      organization: {
        id: '1962d21c-c701-4805-93f6-53a877898756',
        name: 'PagoPA S.p.A.',
        roles: [
          {
            partyRole: 'MANAGER',
            role: 'admin',
          },
        ],
        fiscal_code: '15376371009',
        ipaCode: '5N2TR557',
      },
      uid: 'f07ddb8f-17f9-47d4-b31e-35d1ac10e521',
    },
    API: {
      externalId: {
        origin: 'IPA',
        value: '5N2TR557',
      },
      'user-roles': 'api',
      selfcareId: '1962d21c-c701-4805-93f6-53a877898756',
      organizationId: '69e2865e-65ab-4e48-a638-2037a9ee2ee7',
      organization: {
        id: '69e2865e-65ab-4e48-a638-2037a9ee2ee7',
        name: 'PagoPA S.p.A.',
        roles: [
          {
            partyRole: 'MANAGER',
            role: 'api',
          },
        ],
        fiscal_code: '15376371009',
        ipaCode: '5N2TR557',
      },
      uid: '17a84b7b-dce6-4b8f-a1ae-85926c55f02e',
    },
    SECURITY: {
      externalId: {
        origin: 'IPA',
        value: '5N2TR557',
      },
      'user-roles': 'security',
      selfcareId: '1962d21c-c701-4805-93f6-53a877898756',
      organizationId: '69e2865e-65ab-4e48-a638-2037a9ee2ee7',
      organization: {
        id: '69e2865e-65ab-4e48-a638-2037a9ee2ee7',
        name: 'PagoPA S.p.A.',
        roles: [
          {
            partyRole: 'MANAGER',
            role: 'security',
          },
        ],
        fiscal_code: '15376371009',
        ipaCode: '5N2TR557',
      },
      uid: 'e0477bcc-3baf-4755-aa31-375c051acb44',
    },
    'API,SECURITY': {
      externalId: {
        origin: 'IPA',
        value: '5N2TR557',
      },
      'user-roles': 'api,security',
      selfcareId: '1962d21c-c701-4805-93f6-53a877898756',
      organizationId: '69e2865e-65ab-4e48-a638-2037a9ee2ee7',
      organization: {
        id: '69e2865e-65ab-4e48-a638-2037a9ee2ee7',
        name: 'PagoPA S.p.A.',
        roles: [
          {
            partyRole: 'MANAGER',
            role: 'api',
          },
          {
            partyRole: 'MANAGER',
            role: 'security',
          },
        ],
        fiscal_code: '15376371009',
        ipaCode: '5N2TR557',
      },
      uid: 'e490f02e-9429-4b38-bb11-ddb8a561fb62',
    },
    SUPPORT: {
      externalId: {
        origin: 'IPA',
        value: '5N2TR557',
      },
      'user-roles': 'support',
      selfcareId: '1962d21c-c701-4805-93f6-53a877898756',
      organizationId: '69e2865e-65ab-4e48-a638-2037a9ee2ee7',
      organization: {
        id: '69e2865e-65ab-4e48-a638-2037a9ee2ee7',
        name: 'PagoPA S.p.A.',
        roles: [
          {
            partyRole: 'MANAGER',
            role: 'support',
          },
        ],
        fiscal_code: '15376371009',
        ipaCode: '5N2TR557',
      },
      uid: 'e0477bcc-3baf-4755-aa31-375c051acb44',
    },
  },
  PA1: {
    ADMIN: {
      externalId: {
        origin: 'IPA',
        value: 'c_f205',
      },
      'user-roles': 'admin',
      selfcareId: '026e8c72-7944-4dcd-8668-f596447fec6d',
      organizationId: 'e79a24cd-8edc-441e-ae8d-e87c3aea0059',
      organization: {
        id: 'e79a24cd-8edc-441e-ae8d-e87c3aea0059',
        name: 'Comune di Milano',
        roles: [
          {
            partyRole: 'MANAGER',
            role: 'admin',
          },
        ],
        fiscal_code: '15376371009',
        ipaCode: '5N2TR557',
      },
      uid: 'f07ddb8f-17f9-47d4-b31e-35d1ac10e521',
    },
    API: {
      externalId: {
        origin: 'IPA',
        value: 'c_f205',
      },
      'user-roles': 'api',
      selfcareId: '026e8c72-7944-4dcd-8668-f596447fec6d',
      organizationId: 'e79a24cd-8edc-441e-ae8d-e87c3aea0059',
      organization: {
        id: 'e79a24cd-8edc-441e-ae8d-e87c3aea0059',
        name: 'Comune di Milano',
        roles: [
          {
            partyRole: 'MANAGER',
            role: 'api',
          },
        ],
        fiscal_code: '15376371009',
        ipaCode: '5N2TR557',
      },
      uid: 'c7dc1a86-31f6-4fe9-89cd-184201e29d75',
    },
    SECURITY: {
      externalId: {
        origin: 'IPA',
        value: 'c_f205',
      },
      'user-roles': 'security',
      selfcareId: '026e8c72-7944-4dcd-8668-f596447fec6d',
      organizationId: 'e79a24cd-8edc-441e-ae8d-e87c3aea0059',
      organization: {
        id: 'e79a24cd-8edc-441e-ae8d-e87c3aea0059',
        name: 'Comune di Milano.',
        roles: [
          {
            partyRole: 'MANAGER',
            role: 'security',
          },
        ],
        fiscal_code: '15376371009',
        ipaCode: '5N2TR557',
      },
      uid: '17a84b7b-dce6-4b8f-a1ae-85926c55f02e',
    },
    'API,SECURITY': {
      externalId: {
        origin: 'IPA',
        value: 'c_f205',
      },
      'user-roles': 'api,security',
      selfcareId: '026e8c72-7944-4dcd-8668-f596447fec6d',
      organizationId: 'e79a24cd-8edc-441e-ae8d-e87c3aea0059',
      organization: {
        id: 'e79a24cd-8edc-441e-ae8d-e87c3aea0059',
        name: 'Comune di Milano',
        roles: [
          {
            partyRole: 'MANAGER',
            role: 'security',
          },
          {
            partyRole: 'MANAGER',
            role: 'api',
          },
        ],
        fiscal_code: '15376371009',
        ipaCode: '5N2TR557',
      },
      uid: 'f3d14e3c-d51d-420f-8f47-5a5cbc469143',
    },
    SUPPORT: {
      externalId: {
        origin: 'IPA',
        value: 'c_f205',
      },
      'user-roles': 'support',
      selfcareId: '026e8c72-7944-4dcd-8668-f596447fec6d',
      organizationId: 'e79a24cd-8edc-441e-ae8d-e87c3aea0059',
      organization: {
        id: 'e79a24cd-8edc-441e-ae8d-e87c3aea0059',
        name: 'Comune di Milano',
        roles: [
          {
            partyRole: 'MANAGER',
            role: 'support',
          },
        ],
        fiscal_code: '15376371009',
        ipaCode: '5N2TR557',
      },
      uid: '17a84b7b-dce6-4b8f-a1ae-85926c55f02e',
    },
  },
  PA2: {
    ADMIN: {
      externalId: {
        origin: 'IPA',
        value: 'agid',
      },
      'user-roles': 'admin',
      selfcareId: '83e6fc9d-7f60-4a62-8cec-785524b6a0a5',
      organizationId: '0e9e2dab-2e93-4f24-ba59-38d9f11198ca',
      organization: {
        id: '0e9e2dab-2e93-4f24-ba59-38d9f11198ca',
        name: "Agenzia per L'Italia Digitale",
        roles: [
          {
            partyRole: 'MANAGER',
            role: 'admin',
          },
        ],
        fiscal_code: '15376371009',
        ipaCode: '5N2TR557',
      },
      uid: '4ea722c3-defd-4372-a0c4-b4613072b632',
    },
    API: {
      externalId: {
        origin: 'IPA',
        value: 'agid',
      },
      'user-roles': 'api',
      selfcareId: '83e6fc9d-7f60-4a62-8cec-785524b6a0a5',
      organizationId: '0e9e2dab-2e93-4f24-ba59-38d9f11198ca',
      organization: {
        id: '0e9e2dab-2e93-4f24-ba59-38d9f11198ca',
        name: "Agenzia per L'Italia Digitale",
        roles: [
          {
            partyRole: 'MANAGER',
            role: 'api',
          },
        ],
        fiscal_code: '15376371009',
        ipaCode: '5N2TR557',
      },
      uid: '34f3b33a-afac-421c-8044-690469f15cc5',
    },
    SECURITY: {
      externalId: {
        origin: 'IPA',
        value: 'agid',
      },
      'user-roles': 'security',
      selfcareId: '83e6fc9d-7f60-4a62-8cec-785524b6a0a5',
      organizationId: '0e9e2dab-2e93-4f24-ba59-38d9f11198ca',
      organization: {
        id: '0e9e2dab-2e93-4f24-ba59-38d9f11198ca',
        name: "Agenzia per L'Italia Digitale",
        roles: [
          {
            partyRole: 'MANAGER',
            role: 'security',
          },
        ],
        fiscal_code: '15376371009',
        ipaCode: '5N2TR557',
      },
      uid: 'e490f02e-9429-4b38-bb11-ddb8a561fb62',
    },
    'API,SECURITY': {
      externalId: {
        origin: 'IPA',
        value: 'agid',
      },
      'user-roles': 'api,security',
      selfcareId: '83e6fc9d-7f60-4a62-8cec-785524b6a0a5',
      organizationId: '0e9e2dab-2e93-4f24-ba59-38d9f11198ca',
      organization: {
        id: '0e9e2dab-2e93-4f24-ba59-38d9f11198ca',
        name: "Agenzia per L'Italia Digitale",
        roles: [
          {
            partyRole: 'MANAGER',
            role: 'security',
          },
          {
            partyRole: 'MANAGER',
            role: 'api',
          },
        ],
        fiscal_code: '15376371009',
        ipaCode: '5N2TR557',
      },
      uid: '78b9aa62-a472-4c87-8173-3f73bb2e04b5',
    },
    SUPPORT: {
      externalId: {
        origin: 'IPA',
        value: 'agid',
      },
      'user-roles': 'support',
      selfcareId: '83e6fc9d-7f60-4a62-8cec-785524b6a0a5',
      organizationId: '0e9e2dab-2e93-4f24-ba59-38d9f11198ca',
      organization: {
        id: '0e9e2dab-2e93-4f24-ba59-38d9f11198ca',
        name: "Agenzia per L'Italia Digitale",
        roles: [
          {
            partyRole: 'MANAGER',
            role: 'support',
          },
        ],
        fiscal_code: '15376371009',
        ipaCode: '5N2TR557',
      },
      uid: '78b9aa62-a472-4c87-8173-3f73bb2e04b5',
    },
  },
  PRIVATO: {
    ADMIN: {
      externalId: {
        origin: 'IVASS',
        value: '07160010968',
      },
      'user-roles': 'admin',
      selfcareId: '335a4117-5044-4d28-9473-70b74d3bf072',
      organizationId: 'a7a87b2c-5742-43fb-a847-6304bb0414b4',
      organization: {
        id: 'a7a87b2c-5742-43fb-a847-6304bb0414b4',
        name: 'SOGECAP',
        roles: [
          {
            partyRole: 'MANAGER',
            role: 'admin',
          },
        ],
        fiscal_code: '15376371009',
        ipaCode: '5N2TR557',
      },
      uid: 'c27e3508-3d26-4b6b-9c73-54cb38e6fe1b',
    },
    API: {
      externalId: {
        origin: 'IVASS',
        value: '07160010968',
      },
      'user-roles': 'api',
      selfcareId: '335a4117-5044-4d28-9473-70b74d3bf072',
      organizationId: 'a7a87b2c-5742-43fb-a847-6304bb0414b4',
      organization: {
        id: 'a7a87b2c-5742-43fb-a847-6304bb0414b4',
        name: 'SOGECAP',
        roles: [
          {
            partyRole: 'MANAGER',
            role: 'api',
          },
        ],
        fiscal_code: '15376371009',
        ipaCode: '5N2TR557',
      },
      uid: 'e0477bcc-3baf-4755-aa31-375c051acb44',
    },
    'API,SECURITY': {
      externalId: {
        origin: 'IVASS',
        value: '07160010968',
      },
      'user-roles': 'api,security',
      selfcareId: '335a4117-5044-4d28-9473-70b74d3bf072',
      organizationId: 'a7a87b2c-5742-43fb-a847-6304bb0414b4',
      organization: {
        id: 'a7a87b2c-5742-43fb-a847-6304bb0414b4',
        name: 'SOGECAP',
        roles: [
          {
            partyRole: 'MANAGER',
            role: 'api,security',
          },
        ],
        fiscal_code: '15376371009',
        ipaCode: '5N2TR557',
      },
      uid: '17a84b7b-dce6-4b8f-a1ae-85926c55f02e',
    },
    SECURITY: {
      externalId: {
        origin: 'IVASS',
        value: '07160010968',
      },
      'user-roles': 'security',
      selfcareId: '335a4117-5044-4d28-9473-70b74d3bf072',
      organizationId: 'a7a87b2c-5742-43fb-a847-6304bb0414b4',
      organization: {
        id: 'a7a87b2c-5742-43fb-a847-6304bb0414b4',
        name: 'SOGECAP',
        roles: [
          {
            partyRole: 'MANAGER',
            role: 'security',
          },
        ],
        fiscal_code: '15376371009',
        ipaCode: '5N2TR557',
      },
      uid: 'e490f02e-9429-4b38-bb11-ddb8a561fb62',
    },
    SUPPORT: {
      externalId: {
        origin: 'IVASS',
        value: '07160010968',
      },
      'user-roles': 'support',
      selfcareId: '335a4117-5044-4d28-9473-70b74d3bf072',
      organizationId: 'a7a87b2c-5742-43fb-a847-6304bb0414b4',
      organization: {
        id: 'a7a87b2c-5742-43fb-a847-6304bb0414b4',
        name: 'SOGECAP',
        roles: [
          {
            partyRole: 'MANAGER',
            role: 'support',
          },
        ],
        fiscal_code: '15376371009',
        ipaCode: '5N2TR557',
      },
      uid: 'e490f02e-9429-4b38-bb11-ddb8a561fb62',
    },
  },
}

dotenvConfig({ path: ENV_FILE_PATH })

if (!process.env.REMOTE_WELLKNOWN_URL) {
  console.log('REMOTE_WELLKNOWN_URL not found, please set it in the environment variables')
  process.exit(1)
}

const possibleTenants = Object.keys(ALL_TENANTS)
const possibleRoles = Object.keys(ALL_TENANTS.GSP)

let chosenTenant = process.argv[2]?.toUpperCase() || possibleTenants[0]
let chosenRole = process.argv[3]?.toUpperCase() || possibleRoles[0]

if (!possibleTenants.includes(chosenTenant)) {
  console.log(
    `Invalid tenant: ${chosenTenant}\nPossible tenants: \n- ${possibleTenants.join('\n- ')}`
  )
  process.exit(1)
}

if (!possibleRoles.includes(chosenRole)) {
  console.log(`Invalid role: ${chosenRole}\nPossible roles: \n- ${possibleRoles.join('\n- ')}`)
  process.exit(1)
}

console.log(`> Generating token for ${chosenTenant} tenant with role ${chosenRole}...`)

const token = await generateSessionToken(chosenTenant, chosenRole)

console.log(`> Token retrieved: \n${token}\n\n`)
console.log(`> Writing token to ${ENV_FILE_PATH}...`)

const envFile = readFileSync(ENV_FILE_PATH, 'utf8')
  .split('\n')
  .map((line) => (line.startsWith(ENV_TOKEN_KEY) ? `${ENV_TOKEN_KEY}=${token}` : line))
  .join('\n')

writeFileSync(ENV_FILE_PATH, envFile)

console.log('> Done!')

/**
 *
 * @param {*} stPayloadValuesFilePath File contenente i payload values dei tenant per cui bisogna generare i Session Token
 * @returns stOutputTokens SessionTokens JSON Object - A token for each tenant/role
 */
async function generateSessionToken(tenant, role) {
  const wellKnownUrl = new URL(process.env.REMOTE_WELLKNOWN_URL)
  const { kid, alg } = await fetchWellKnown(
    wellKnownUrl.protocol.indexOf('https') >= 0,
    wellKnownUrl.toString()
  )
  if (!kid || !alg) {
    console.error('\tKid or alg not found.')
    return
  }
  config.kms.kid = kid
  // Step 3. Generate STs header - Populate Session Token header from template
  const sessionTokenHeaderTemplate = {
    typ: 'at+jwt',
    alg: 'WELL_KNOWN_ALG',
    use: 'sig',
    kid: 'WELL_KNOWN_KID',
  }
  const stHeaderCompiled = Object.assign({}, sessionTokenHeaderTemplate, {
    kid,
    alg,
  })

  // Step 4. Generate STs payload
  const epochTimeSeconds = Math.round(new Date().getTime() / 1000)
  const epochTimeExpSeconds = epochTimeSeconds + Number(SESSION_TOKENS_DURATION_SECONDS)
  const randomUUID = uuidv4()

  const sessionTokenPayloadTemplate = {
    externalId: {
      origin: 'VALUES_EXT_ID_ORIGIN',
      value: 'VALUES_EXT_ID_VALUE',
    },
    'user-roles': 'VALUES_USER_ROLES',
    selfcareId: 'VALUES_SELFCARE_ID',
    organizationId: 'VALUES_ORG_ID',
    uid: 'VALUES_UID',
    iss: '{{ENVIRONMENT}}.interop.pagopa.it',
    aud: '{{ENVIRONMENT}}.interop.pagopa.it/ui',
    nbf: 123,
    iat: 123,
    exp: 456,
    jti: 'uuid',
  }

  let stPayloadCompiled = Object.assign({}, sessionTokenPayloadTemplate, {
    nbf: epochTimeSeconds,
    iat: epochTimeSeconds,
    exp: epochTimeExpSeconds,
    jti: randomUUID,
  })
  stPayloadCompiled = JSON.parse(
    JSON.stringify(stPayloadCompiled).replaceAll('{{ENVIRONMENT}}', 'dev')
  )

  const unsignedSTs = unsignedStsGeneration(stHeaderCompiled, stPayloadCompiled, {
    [tenant]: {
      [role]: ALL_TENANTS[tenant][role],
    },
  })

  return (await signedStsGeneration(unsignedSTs))[tenant][role]
}

async function fetchWellKnown(isSecure, wellKnownUrl) {
  const jwksObj = await new Promise((resolve, reject) => {
    const httpMod = isSecure ? https : http

    httpMod
      .get(wellKnownUrl, (res) => {
        const { statusCode } = res
        const contentType = res.headers['content-type']

        let error
        // Any 2xx status code signals a successful response but
        // here we're only checking for 200.
        if (statusCode !== 200) {
          error = new Error('Request Failed.\n' + `Status Code: ${statusCode}`)
        } else if (!/^application\/json/.test(contentType)) {
          error = new Error(
            'Invalid content-type.\n' + `Expected application/json but received ${contentType}`
          )
        }
        if (error) {
          console.error(error.message)
          // Consume response data to free up memory
          res.resume()
          reject(error)
          return
        }

        let rawData = ''

        res.setEncoding('utf8')
        res.on('data', (chunk) => {
          rawData += chunk
        })
        res.on('end', () => {
          try {
            const parsedData = JSON.parse(rawData)
            resolve(parsedData)
          } catch (e) {
            console.error(e.message)
            reject(e)
          }
        })
      })
      .on('error', (e) => {
        reject(e)
      })
  })

  if (typeof jwksObj != 'undefined' && jwksObj.keys && jwksObj.keys[0]) {
    return _.pick(jwksObj.keys[0], ['kid', 'alg'])
  }

  return null
}

// Generate signed tokens from unsigned ones
async function signedStsGeneration(unsignedStValues) {
  const signedTokens = {}
  for (const tenant of Object.keys(unsignedStValues)) {
    signedTokens[tenant] = {}

    for (const tenantRole of Object.keys(unsignedStValues[tenant])) {
      const currentUnsignedJwt = unsignedStValues[tenant][tenantRole]
      const { signedToken, signature } = await kmsSign(currentUnsignedJwt)

      if (!(await kmsVerify(currentUnsignedJwt, signature))) {
        throw Error('\tSigned Token generation process failed to verify signature')
      }

      signedTokens[tenant][tenantRole] = signedToken
    }
  }
  return signedTokens
}

function unsignedStsGeneration(stHeaderCompiled, stPayloadCompiled, stPayloadValues) {
  try {
    const stsSubOutput = {}
    for (const tenant of Object.keys(stPayloadValues)) {
      stsSubOutput[tenant] = {}

      for (const interopRole of Object.keys(stPayloadValues[tenant])) {
        stsSubOutput[tenant][interopRole] = Object.assign(
          {},
          stPayloadCompiled,
          stPayloadValues[tenant][interopRole]
        )
      }
    }
    const base64Header = b64UrlEncode(JSON.stringify(stHeaderCompiled))
    const stOutputIntermediate = {}
    for (const tenant of Object.keys(stsSubOutput)) {
      stOutputIntermediate[tenant] = {}

      for (const interopRole of Object.keys(stsSubOutput[tenant])) {
        const base64Role = b64UrlEncode(JSON.stringify(stsSubOutput[tenant][interopRole]))
        const poJwtForRole = `${base64Header}.${base64Role}`

        stOutputIntermediate[tenant][interopRole] = poJwtForRole
      }
    }

    return stOutputIntermediate
  } catch (ex) {
    console.error(ex)
    throw ex
  }
}

// KMS Wrappers
async function kmsSign(serializedToken) {
  if (!serializedToken) {
    throw Error(`kmsSign: invalid input - missing`)
  }

  // SignCommandInput
  const signCommandParams = {
    KeyId: config.kms.kid,
    Message: new TextEncoder().encode(serializedToken),
    SigningAlgorithm: config.kms.alg,
  }

  const signCommand = new SignCommand(signCommandParams)
  const response = await kmsClient.send(signCommand)
  const responseSignature = response.Signature

  if (!responseSignature) {
    throw Error('JWT Signature failed. Empty signature returned')
  }

  const kmsSignature = b64ByteUrlEncode(responseSignature)

  return {
    signedToken: `${serializedToken}.${kmsSignature}`,
    signature: responseSignature,
  }
}

async function kmsVerify(unsignedToken, signature) {
  if (!unsignedToken || !signature) {
    throw Error(`kmsVerify: invalid input - missing`)
  }

  // VerifyCommandInput
  const commandParams = {
    KeyId: config.kms.kid,
    Message: new TextEncoder().encode(unsignedToken),
    SigningAlgorithm: config.kms.alg,
    Signature: signature,
  }
  const verifyCommand = new VerifyCommand(commandParams)
  const response = await kmsClient.send(verifyCommand)

  if (!response.SignatureValid) {
    throw Error('JWT Verify Signature failed')
  }

  return response.SignatureValid
}

// Encoding utilities
/**
 * Encode a byte array to a url encoded base64 string, as specified in RFC 7515 Appendix C
 */
function b64ByteUrlEncode(b) {
  return bufferB64UrlEncode(Buffer.from(b))
}

/**
 * Encode a string to a url encoded base64 string, as specified in RFC 7515 Appendix C
 */
function b64UrlEncode(str) {
  return bufferB64UrlEncode(Buffer.from(str, 'binary'))
}

function bufferB64UrlEncode(b) {
  return b.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}
