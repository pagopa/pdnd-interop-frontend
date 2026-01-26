import { mockEnvironmentParams, renderWithApplicationContext } from '@/utils/testing.utils'
import { ConsumerAgreementDetailsGeneralInfoSection } from '../ConsumerAgreementDetailsGeneralInfoSection/ConsumerAgreementDetailsGeneralInfoSection'
import { createMockAgreement } from '../../../../../__mocks__/data/agreement.mocks'
import * as ConsumerAgreementContext from '../ConsumerAgreementDetailsContext'
import { fireEvent } from '@testing-library/react'
const agreementMock = createMockAgreement()

vi.mock('react-i18next', () => ({
  useTranslation: (namespace: string, options?: { keyPrefix?: string }) => {
    return {
      t: (key: string, params?: Record<string, unknown>) => {
        if (params) {
          let translation = ''

          Object.entries(params).forEach(([_paramKey, value]) => {
            translation += `${value}`
          })

          return translation
        } else {
          const keyPrefix = options?.keyPrefix || ''
          const fullKey = keyPrefix ? `${keyPrefix}.${key}` : key
          return `${namespace}.${fullKey}`
        }
      },
      i18n: {
        language: 'it',
        changeLanguage: vi.fn(),
      },
    }
  },
  Trans: ({ children }: { children: React.ReactNode }) => children,
}))

vi.mock('@pagopa/interop-fe-commons', async () => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const actual = await vi.importActual<typeof import('@pagopa/interop-fe-commons')>(
    '@pagopa/interop-fe-commons'
  )

  return {
    ...actual,
    InformationContainer: ({ label, content }: { label: string; content: string }) => (
      <div>
        <span data-testid="label">{label}</span>
        <span data-testid="content">{content}</span>
      </div>
    ),
  }
})

const mockDownloadSignedContract = vi.fn()
const mockDownloadContract = vi.fn()

vi.mock('@/api/agreement', () => ({
  AgreementDownloads: {
    useDownloadSignedContract: () => mockDownloadSignedContract,
    useDownloadContract: () => mockDownloadContract,
  },
}))
function mockUseConsumerAgreementDetailsContext() {
  const useConsumerAgreementDetailsContextSpy = vi
    .spyOn(ConsumerAgreementContext, 'useConsumerAgreementDetailsContext')
    .mockReturnValue({
      agreement: agreementMock,
      descriptorAttributes: {
        certified: [],
        declared: [],
        verified: [],
      },
    })
  return useConsumerAgreementDetailsContextSpy
}

describe('ConsumerPurposeDetailsGeneralInfoSection', () => {
  it('should render correctly', () => {
    mockUseConsumerAgreementDetailsContext()
    const screen = renderWithApplicationContext(<ConsumerAgreementDetailsGeneralInfoSection />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen).toBeDefined()
  })

  it('should display which for which e-service request agreement has been made', () => {
    mockUseConsumerAgreementDetailsContext()
    const screen = renderWithApplicationContext(<ConsumerAgreementDetailsGeneralInfoSection />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    const eserviceRequestFieldLabel = screen.getByText(
      `${agreementMock.eservice.name}${agreementMock.eservice.version}`
    )
    expect(eserviceRequestFieldLabel).toBeInTheDocument()
  })

  it('should display provider(erogatore)', () => {
    mockUseConsumerAgreementDetailsContext()
    const screen = renderWithApplicationContext(<ConsumerAgreementDetailsGeneralInfoSection />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    const producerAgreementName = screen.getByText(agreementMock.producer.name)
    expect(producerAgreementName).toBeInTheDocument()
  })

  it('should display consumer (fruitore)', () => {
    mockUseConsumerAgreementDetailsContext()
    const screen = renderWithApplicationContext(<ConsumerAgreementDetailsGeneralInfoSection />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    const consumerAgreementName = screen.getByText(agreementMock.consumer.name)
    expect(consumerAgreementName).toBeInTheDocument()
  })

  it('should not be available download of signed agreement if document is not ready yet', () => {
    mockUseConsumerAgreementDetailsContext()
    const screen = renderWithApplicationContext(<ConsumerAgreementDetailsGeneralInfoSection />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    const downloadButton = screen.queryByRole('button', {
      name: /agreement.consumerRead.sections.generalInformations.documentation.link.label/i,
    })
    expect(downloadButton).toBeDisabled()
  })

  it('should be available download of signed agreement if document is ready', () => {
    const agreementWithDocumentReady = {
      ...agreementMock,
      isDocumentReady: true,
    }
    vi.spyOn(ConsumerAgreementContext, 'useConsumerAgreementDetailsContext').mockReturnValue({
      agreement: agreementWithDocumentReady,
      descriptorAttributes: {
        certified: [],
        declared: [],
        verified: [],
      },
    })
    const screen = renderWithApplicationContext(<ConsumerAgreementDetailsGeneralInfoSection />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    const downloadButton = screen.getByRole('button', {
      name: /agreement.consumerRead.sections.generalInformations.documentation.link.label/i,
    })
    expect(downloadButton).toBeEnabled()
  })

  describe('FEATURE_FLAG_USE_SIGNED_DOCUMENT', () => {
    it('should able to download signedDocument when feature flag is enabled', async () => {
      const agreementWithDocumentReady = {
        ...agreementMock,
        isDocumentReady: true,
      }
      vi.spyOn(ConsumerAgreementContext, 'useConsumerAgreementDetailsContext').mockReturnValue({
        agreement: agreementWithDocumentReady,
        descriptorAttributes: {
          certified: [],
          declared: [],
          verified: [],
        },
      })
      const screen = renderWithApplicationContext(<ConsumerAgreementDetailsGeneralInfoSection />, {
        withReactQueryContext: true,
        withRouterContext: true,
      })

      const downloadButton = screen.getByTestId('download-agreement-document-button')

      screen.debug(downloadButton)

      fireEvent.click(downloadButton)
      expect(mockDownloadSignedContract).toHaveBeenCalledOnce()
    })

    it('should able to download "classic" document when feature flag is disabled', () => {
      mockEnvironmentParams('FEATURE_FLAG_USE_SIGNED_DOCUMENT', false)
      const agreementWithDocumentReady = {
        ...agreementMock,
        isDocumentReady: true,
      }
      vi.spyOn(ConsumerAgreementContext, 'useConsumerAgreementDetailsContext').mockReturnValue({
        agreement: agreementWithDocumentReady,
        descriptorAttributes: {
          certified: [],
          declared: [],
          verified: [],
        },
      })
      const screen = renderWithApplicationContext(<ConsumerAgreementDetailsGeneralInfoSection />, {
        withReactQueryContext: true,
        withRouterContext: true,
      })

      const downloadButton = screen.getByTestId('download-agreement-document-button')

      screen.debug(downloadButton)

      fireEvent.click(downloadButton)
      expect(mockDownloadContract).toHaveBeenCalledOnce()
    })
  })
})
