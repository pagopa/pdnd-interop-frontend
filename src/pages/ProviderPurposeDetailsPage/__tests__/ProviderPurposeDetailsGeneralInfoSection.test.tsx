import { renderWithApplicationContext } from '@/utils/testing.utils'
import { ProviderPurposeDetailsGeneralInfoSection } from '../components/ProviderPurposeDetailsGeneralInfoSection'
import { createMockPurpose } from '../../../../__mocks__/data/purpose.mocks'

const purpose = createMockPurpose()

vi.mock('react-i18next', () => ({
  useTranslation: (namespace: string, options?: { keyPrefix?: string }) => {
    const keyPrefix = options?.keyPrefix || ''
    return {
      t: (key: string) => {
        const fullKey = keyPrefix ? `${keyPrefix}.${key}` : key
        return `${namespace}.${fullKey}`
      },
      i18n: {
        language: 'en',
        changeLanguage: vi.fn(),
      },
    }
  },
}))

describe('ProviderPurposeDetailsGeneralInfoSection', () => {
  it('Should render correctly', () => {
    const screen = renderWithApplicationContext(
      <ProviderPurposeDetailsGeneralInfoSection purpose={purpose} />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )

    expect(screen).toBeDefined()
  })

  it('Should visibile Eservice link', () => {
    const screen = renderWithApplicationContext(
      <ProviderPurposeDetailsGeneralInfoSection purpose={purpose} />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )

    const eserviceLink = screen.getByRole('link', {
      name: 'purpose.providerView.sections.generalInformations.eServiceField.value',
    })
    expect(eserviceLink).toBeInTheDocument()
  })

  it('Should visible consumer of my purpose (fruitore)', () => {
    const screen = renderWithApplicationContext(
      <ProviderPurposeDetailsGeneralInfoSection purpose={purpose} />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )

    const consumerField = screen.getByText(purpose.consumer.name)
    expect(consumerField).toBeInTheDocument()
  })

  it('Should not be avialable chance to download risk analysisDocument if isDocumentReady is false', () => {
    const mockPurposeWithDocumentNotReady = { ...purpose, isDocumentReady: false }
    const screen = renderWithApplicationContext(
      <ProviderPurposeDetailsGeneralInfoSection purpose={mockPurposeWithDocumentNotReady} />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )

    const downloadButton = screen.getByRole('button', {
      name: 'purpose.providerView.sections.generalInformations.riskAnalysis.link.label',
    })
    expect(downloadButton).toBeDisabled()
  })

  it('Should be avialable chance to download risk analysisDocument if isDocumentReady is true', () => {
    const mockPurposeWithDocumentReady = { ...purpose, isDocumentReady: true }
    const screen = renderWithApplicationContext(
      <ProviderPurposeDetailsGeneralInfoSection purpose={mockPurposeWithDocumentReady} />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )

    const downloadButton = screen.getByRole('button', {
      name: 'purpose.providerView.sections.generalInformations.riskAnalysis.link.label',
    })
    expect(downloadButton).toBeInTheDocument()
  })
})
