import { renderWithApplicationContext } from '@/utils/testing.utils'
import { ProviderPurposeDetailsGeneralInfoSection } from '../components/ProviderPurposeDetailsGeneralInfoSection'
import { createMockPurpose } from '../../../../__mocks__/data/purpose.mocks'
import { Purpose } from '@/api/api.generatedTypes'

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

  it('Should display Eservice link', () => {
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

  it('Should not be available chance to download riskAnalysis if currentVersion is not defined', () => {
    const mockPurposeWithoutCurrentVersion = { ...purpose, currentVersion: undefined }
    const screen = renderWithApplicationContext(
      <ProviderPurposeDetailsGeneralInfoSection purpose={mockPurposeWithoutCurrentVersion} />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )

    const downloadButton = screen.queryByRole('button', {
      name: 'purpose.providerView.sections.generalInformations.riskAnalysis.link.label',
    })
    expect(downloadButton).not.toBeInTheDocument()
  })

  it('Should not be available chance to download risk analysisDocument if isDocumentReady is false', () => {
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

  it("Should visible purpose's template name if purpose is inherited from a purpose template", () => {
    const mockPurposeInheritedFromTemplate: Purpose = {
      ...purpose,
      purposeTemplate: {
        id: 'purpose-template-id',
        purposeTitle: 'Purpose Template Name',
      },
    }

    const screen = renderWithApplicationContext(
      <ProviderPurposeDetailsGeneralInfoSection purpose={mockPurposeInheritedFromTemplate} />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )

    const templateNameField = screen.getByText('Purpose Template Name')
    expect(templateNameField).toBeInTheDocument()
  })
})
