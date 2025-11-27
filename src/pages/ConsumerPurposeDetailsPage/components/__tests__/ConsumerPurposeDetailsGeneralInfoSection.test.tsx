import { mockEnvironmentParams, renderWithApplicationContext } from '@/utils/testing.utils'
import { createMockPurpose } from '../../../../../__mocks__/data/purpose.mocks'
import { ConsumerPurposeDetailsGeneralInfoSection } from '../PurposeDetailsTab/ConsumerPurposeDetailsGeneralInfoSection'
import { fireEvent } from '@testing-library/react'
import { type Purpose } from '@/api/api.generatedTypes'
import * as envs from '@/config/env'

const purpose = createMockPurpose()

const downloadSignedRiskAnalysisMock = vi.fn()
const downloadRiskAnalysis = vi.fn()

vi.mock('@/api/purpose', () => ({
  PurposeDownloads: {
    useDownloadSignedRiskAnalysis: () => downloadSignedRiskAnalysisMock,
    useDownloadRiskAnalysis: () => downloadRiskAnalysis,
  },
}))

vi.mock('react-i18next', () => ({
  useTranslation: (namespace: string, options?: { keyPrefix?: string }) => {
    const keyPrefix = options?.keyPrefix || ''
    return {
      t: (key: string) => {
        const fullKey = keyPrefix ? `${keyPrefix}.${key}` : key
        return `${namespace}.${fullKey}`
      },
      i18n: {
        language: 'it',
        changeLanguage: vi.fn(),
      },
    }
  },
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

describe('ConsumerPurposeDetailsGeneralInfoSection', () => {
  it('should render correctly', () => {
    const screen = renderWithApplicationContext(
      <ConsumerPurposeDetailsGeneralInfoSection purpose={purpose} />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )

    expect(screen).toBeDefined()
  })

  it('should display eService link', () => {
    const screen = renderWithApplicationContext(
      <ConsumerPurposeDetailsGeneralInfoSection purpose={purpose} />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )

    const eserviceLink = screen.getByRole('link', {
      name: 'purpose.consumerView.sections.generalInformations.eServiceField.value',
    })

    expect(eserviceLink).toBeInTheDocument()
  })
  it("should display purpose's provider (erogatore)", () => {
    const screen = renderWithApplicationContext(
      <ConsumerPurposeDetailsGeneralInfoSection purpose={purpose} />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )

    screen.debug()
    const providerField = screen.getAllByText(purpose.eservice.producer.name)[0]
    expect(providerField).toBeInTheDocument()
  })

  it('should not be available the download of the signed risk analysis document if document is not ready yet', () => {
    const mockPurposeWithDocumentNotReady = { ...purpose, isDocumentReady: false }
    const screen = renderWithApplicationContext(
      <ConsumerPurposeDetailsGeneralInfoSection purpose={mockPurposeWithDocumentNotReady} />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )

    const downloadButton = screen.getByRole('button', {
      name: 'purpose.consumerView.sections.generalInformations.riskAnalysis.link.label',
    })
    expect(downloadButton).toBeDisabled()
  })

  it('should be available the download of the signed risk analysis document if document is already available', () => {
    const mockPurposeWithDocumentReady: Purpose = { ...purpose, isDocumentReady: true }
    const screen = renderWithApplicationContext(
      <ConsumerPurposeDetailsGeneralInfoSection purpose={mockPurposeWithDocumentReady} />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )

    const downloadButton = screen.getByRole('button', {
      name: 'purpose.consumerView.sections.generalInformations.riskAnalysis.link.label',
    })
    expect(downloadButton).toBeEnabled()
  })

  it('should display correct agreement link', () => {
    const screen = renderWithApplicationContext(
      <ConsumerPurposeDetailsGeneralInfoSection purpose={purpose} />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )

    const agreementLink = screen.getByRole('link', {
      name: 'purpose.consumerView.sections.generalInformations.agreementLink.label',
    })

    screen.debug(agreementLink)
    expect(agreementLink).toHaveAttribute(
      'href',
      `/ui/it/fruizione/richieste/${purpose.agreement.id}`
    )
  })

  describe('FEATURE_FLAG_USE_SIGNED_DOCUMENT', () => {
    it('should download signed riskAnalysis document when feature flag is enabled', () => {
      const mockPurposeWithDocumentReady: Purpose = {
        ...purpose,
        isDocumentReady: true,
        currentVersion: {
          ...purpose.currentVersion!,
          signedContract: {
            id: 'signed-contract-id',
            contentType: 'application/pdf',
            createdAt: '2021-01-01T00:00:00Z',
            signedAt: '2021-01-01T00:00:00Z',
          },
        },
      }
      const screen = renderWithApplicationContext(
        <ConsumerPurposeDetailsGeneralInfoSection purpose={mockPurposeWithDocumentReady} />,
        {
          withReactQueryContext: true,
          withRouterContext: true,
        }
      )

      const downloadButton = screen.getByRole('button', {
        name: 'purpose.consumerView.sections.generalInformations.riskAnalysis.link.label',
      })

      fireEvent.click(downloadButton)
      expect(downloadSignedRiskAnalysisMock).toHaveBeenCalledOnce()
    })
    it('should download "classic" riskAnalysis document when feature flag is disabled', () => {
      mockEnvironmentParams('FEATURE_FLAG_USE_SIGNED_DOCUMENT', false)

      const mockPurposeWithDocumentReady: Purpose = {
        ...purpose,
        isDocumentReady: true,
      }
      const screen = renderWithApplicationContext(
        <ConsumerPurposeDetailsGeneralInfoSection purpose={mockPurposeWithDocumentReady} />,
        {
          withReactQueryContext: true,
          withRouterContext: true,
        }
      )

      const downloadButton = screen.getByRole('button', {
        name: 'purpose.consumerView.sections.generalInformations.riskAnalysis.link.label',
      })

      fireEvent.click(downloadButton)
      expect(downloadRiskAnalysis).toHaveBeenCalledOnce()
    })
  })
})
