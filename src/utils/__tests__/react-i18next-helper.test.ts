import { vi } from 'vitest'
import { createMockReactI18next } from '../__mocks__/react-i18next-helper'

describe('createMockReactI18next', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('useTranslation', () => {
    it('should return translation function with default language', () => {
      const mock = createMockReactI18next()
      const { t, i18n } = mock.useTranslation('test-namespace')

      expect(t('test.key')).toBe('test-namespace.test.key')
      expect(i18n.language).toBe('en')
      expect(i18n.changeLanguage).toBeDefined()
      expect(typeof i18n.changeLanguage).toBe('function')
    })

    it('should return translation function with custom language', () => {
      const mock = createMockReactI18next('it')
      const { t, i18n } = mock.useTranslation('test-namespace')

      expect(t('test.key')).toBe('test-namespace.test.key')
      expect(i18n.language).toBe('it')
    })

    it('should handle translation without keyPrefix', () => {
      const mock = createMockReactI18next()
      const { t } = mock.useTranslation('test-namespace')

      expect(t('simpleKey')).toBe('test-namespace.simpleKey')
    })

    it('should handle translation with keyPrefix', () => {
      const mock = createMockReactI18next()
      const { t } = mock.useTranslation('test-namespace', {
        keyPrefix: 'section',
      })

      expect(t('key')).toBe('test-namespace.section.key')
    })

    it('should handle nested keyPrefix', () => {
      const mock = createMockReactI18next()
      const { t } = mock.useTranslation('test-namespace', {
        keyPrefix: 'section.subsection',
      })

      expect(t('key')).toBe('test-namespace.section.subsection.key')
    })

    it('should handle empty keyPrefix', () => {
      const mock = createMockReactI18next()
      const { t } = mock.useTranslation('test-namespace', {
        keyPrefix: '',
      })

      expect(t('key')).toBe('test-namespace.key')
    })

    it('should handle multiple translation calls with same namespace', () => {
      const mock = createMockReactI18next()
      const { t } = mock.useTranslation('test-namespace')

      expect(t('key1')).toBe('test-namespace.key1')
      expect(t('key2')).toBe('test-namespace.key2')
      expect(t('key3')).toBe('test-namespace.key3')
    })

    it('should handle different namespaces', () => {
      const mock = createMockReactI18next()
      const { t: t1 } = mock.useTranslation('namespace1')
      const { t: t2 } = mock.useTranslation('namespace2')

      expect(t1('key')).toBe('namespace1.key')
      expect(t2('key')).toBe('namespace2.key')
    })

    it('should return changeLanguage as a mock function', () => {
      const mock = createMockReactI18next()
      const { i18n } = mock.useTranslation('test-namespace')

      expect(vi.isMockFunction(i18n.changeLanguage)).toBe(true)
    })

    it('should allow calling changeLanguage', () => {
      const mock = createMockReactI18next()
      const { i18n } = mock.useTranslation('test-namespace')

      i18n.changeLanguage('fr')

      expect(i18n.changeLanguage).toHaveBeenCalledWith('fr')
      expect(i18n.changeLanguage).toHaveBeenCalledTimes(1)
    })
  })
})
