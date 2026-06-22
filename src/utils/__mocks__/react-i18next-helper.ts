import { vi } from 'vitest'

/**
 * Creates a mock configuration for react-i18next that handles namespace and keyPrefix.
 * This mock returns translation keys in the format: namespace.keyPrefix.key
 *
 * @param language - The language code to use (default: 'en')
 * @returns The mock configuration object for vi.mock('react-i18next')
 */
export function createMockReactI18next(language: string = 'en') {
  return {
    useTranslation: (namespace: string, options?: { keyPrefix?: string }) => {
      const keyPrefix = options?.keyPrefix || ''
      return {
        t: (key: string) => {
          const fullKey = keyPrefix ? `${keyPrefix}.${key}` : key
          return `${namespace}.${fullKey}`
        },
        i18n: {
          language,
          changeLanguage: vi.fn(),
        },
      }
    },
  }
}
