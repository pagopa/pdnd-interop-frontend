import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const frontendRoot = process.cwd()
const frontendErrorsFile = path.join(frontendRoot, 'src/config/errors.ts')
const backendRepositoryRawBaseUrl =
  'https://raw.githubusercontent.com/pagopa/interop-be-monorepo/develop'
const backendRepositoryBlobBaseUrl = 'https://github.com/pagopa/interop-be-monorepo/blob/develop'
const localeFiles = [
  path.join(frontendRoot, 'src/static/locales/en/error.json'),
  path.join(frontendRoot, 'src/static/locales/it/error.json'),
]

const serviceErrorSources = [
  {
    prefix: '001',
    file: 'packages/catalog-process/src/model/domain/errors.ts',
  },
  {
    prefix: '002',
    file: 'packages/agreement-process/src/model/domain/errors.ts',
  },
  {
    prefix: '003',
    file: 'packages/attribute-registry-process/src/model/domain/errors.ts',
  },
  {
    prefix: '004',
    file: 'packages/purpose-process/src/model/domain/errors.ts',
  },
  {
    prefix: '005',
    file: 'packages/tenant-process/src/model/domain/errors.ts',
  },
  {
    prefix: '006',
    file: 'packages/authorization-process/src/model/domain/errors.ts',
  },
  {
    prefix: '008',
    file: 'packages/backend-for-frontend/src/model/errors.ts',
  },
  {
    prefix: '010',
    file: 'packages/delegation-process/src/model/domain/errors.ts',
  },
  {
    prefix: '011',
    file: 'packages/eservice-template-process/src/model/domain/errors.ts',
  },
  {
    prefix: '013',
    file: 'packages/in-app-notification-manager/src/model/errors.ts',
  },
  {
    prefix: '014',
    file: 'packages/notification-config-process/src/model/domain/errors.ts',
  },
  {
    prefix: '015',
    file: 'packages/purpose-template-process/src/model/domain/errors.ts',
  },
]

const strict = process.argv.includes('--strict')

const readTextFile = (file) => fs.readFileSync(file, 'utf8')

const warn = (message) => {
  console.warn(`[error-mappings] ${message}`)
}

const fetchBackendFile = async (file) => {
  const response = await fetch(`${backendRepositoryRawBaseUrl}/${file}`)

  if (!response.ok) {
    throw new Error(`Unable to fetch ${file}: ${response.status} ${response.statusText}`)
  }

  return response.text()
}

const getBackendFileUrl = (file) => `${backendRepositoryBlobBaseUrl}/${file}`

const parseBackendErrorCodes = (source) => {
  const errorCodesBlock = source.match(/const errorCodes = \{(?<body>[\s\S]*?)\n\}/)
  if (!errorCodesBlock?.groups?.body) return []

  return [
    ...errorCodesBlock.groups.body.matchAll(/\b([A-Za-z][A-Za-z0-9_]*)\s*:\s*"([0-9]{4})"/g),
  ].map((match) => ({
    key: match[1],
    suffix: match[2],
  }))
}

const parseFrontendMappedErrors = () => {
  const source = readTextFile(frontendErrorsFile)
  const exactCodes = new Map()

  for (const match of source.matchAll(/'([0-9]{3}-[0-9]{4})': '([^']+)'/g)) {
    exactCodes.set(match[1], match[2])
  }

  return exactCodes
}

const readTranslations = () => {
  const translations = new Map()

  for (const file of localeFiles) {
    const locale = path.basename(path.dirname(file))
    const content = JSON.parse(readTextFile(file))
    translations.set(locale, new Set(Object.keys(content['errors-bff'] ?? {})))
  }

  return translations
}

const run = async () => {
  const frontendMappings = parseFrontendMappedErrors()
  const translations = readTranslations()
  const expectedMappings = new Map()
  const unavailableBackendFiles = []

  await Promise.all(
    serviceErrorSources.map(async ({ prefix, file }) => {
      try {
        const backendErrors = parseBackendErrorCodes(await fetchBackendFile(file))

        for (const { key, suffix } of backendErrors) {
          expectedMappings.set(`${prefix}-${suffix}`, {
            key,
            source: getBackendFileUrl(file),
          })
        }
      } catch (error) {
        unavailableBackendFiles.push({
          file,
          message: error instanceof Error ? error.message : String(error),
        })
      }
    })
  )

  const missingMappings = [...expectedMappings.entries()]
    .filter(([code]) => !frontendMappings.has(code))
    .map(([code, { key, source }]) => ({ code, key, source }))

  const mappedTranslationKeys = new Set(frontendMappings.values())
  const missingTranslations = []
  for (const [locale, translationKeys] of translations) {
    for (const key of mappedTranslationKeys) {
      if (!translationKeys.has(key)) {
        missingTranslations.push({ locale, key })
      }
    }
  }

  for (const { file, message } of unavailableBackendFiles) {
    warn(`Backend error source unavailable on GitHub develop: ${file} (${message})`)
  }

  if (
    unavailableBackendFiles.length === 0 &&
    missingMappings.length === 0 &&
    missingTranslations.length === 0
  ) {
    console.log('[error-mappings] Backend error mappings and translations are aligned.')
    return 0
  }

  if (missingMappings.length > 0) {
    warn('Backend errors missing from src/config/errors.ts:')
    for (const { code, key, source } of missingMappings) {
      warn(`  ${code} -> ${key} (${source})`)
    }
  }

  if (missingTranslations.length > 0) {
    warn('Mapped frontend error keys missing from locale files:')
    for (const { locale, key } of missingTranslations) {
      warn(`  ${locale}: ${key}`)
    }
  }

  return strict ? 1 : 0
}

process.exitCode = await run()
