import { renderWithApplicationContext } from '@/utils/testing.utils'
import { ProviderPurposeDetailsGeneralInfoSection } from '../components/ProviderPurposeDetailsGeneralInfoSection'
import { createMockPurpose } from '../../../../__mocks__/data/purpose.mocks'
import type { Purpose } from '@/api/api.generatedTypes'

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

  it('hides the download during reactivation approval even when the previous signed PDF is ready', () => {
    const suspendedVersion = {
      ...purpose.currentVersion!,
      state: 'SUSPENDED' as const,
      signedContract: {
        id: 'signed-contract-id',
        contentType: 'application/pdf',
        createdAt: '2023-02-03T08:26:43.049Z',
        signedAt: '2023-02-03T08:26:43.139Z',
      },
    }
    const waitingForApprovalVersion = {
      id: 'reactivation-version-id',
      state: 'WAITING_FOR_APPROVAL' as const,
      dailyCalls: suspendedVersion.dailyCalls,
      createdAt: '2023-02-04T08:26:43.139Z',
    }
    const purposeAwaitingReactivation: Purpose = {
      ...purpose,
      currentVersion: undefined,
      waitingForApprovalVersion,
      versions: [suspendedVersion, waitingForApprovalVersion],
      suspendedByConsumer: true,
      isDocumentReady: true,
    }
    const screen = renderWithApplicationContext(
      <ProviderPurposeDetailsGeneralInfoSection purpose={purposeAwaitingReactivation} />,
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

  it.each([undefined, purpose.currentVersion?.riskAnalysisDocument])(
    'shows the download disabled after activation while the signed PDF is not ready (base PDF: %j)',
    (riskAnalysisDocument) => {
      const mockPurposeWithDocumentNotReady: Purpose = {
        ...purpose,
        isDocumentReady: false,
        currentVersion: { ...purpose.currentVersion!, riskAnalysisDocument },
      }
      const screen = renderWithApplicationContext(
        <ProviderPurposeDetailsGeneralInfoSection purpose={mockPurposeWithDocumentNotReady} />,
        {
          withReactQueryContext: true,
          withRouterContext: true,
        }
      )

      expect(
        screen.getByRole('button', {
          name: 'purpose.providerView.sections.generalInformations.riskAnalysis.link.label',
        })
      ).toBeDisabled()
    }
  )

  it('enables the download when the signed PDF is ready', () => {
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
      <ProviderPurposeDetailsGeneralInfoSection purpose={mockPurposeWithDocumentReady} />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )

    const downloadButton = screen.getByRole('button', {
      name: 'purpose.providerView.sections.generalInformations.riskAnalysis.link.label',
    })
    expect(downloadButton).toBeEnabled()
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
