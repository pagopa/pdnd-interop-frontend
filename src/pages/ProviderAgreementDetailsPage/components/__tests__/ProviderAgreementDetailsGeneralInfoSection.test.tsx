import { fireEvent } from '@testing-library/react'
import { createMockAgreement } from '../../../../../__mocks__/data/agreement.mocks'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import * as ProviderAgreementDetailsContext from '../ProviderAgreementDetailsContext'
import { ProviderAgreementDetailsGeneralInfoSection } from '../ProviderAgreementDetailsGeneralInfoSection/ProviderAgreementDetailsGeneralInfoSection'

const agreementMock = createMockAgreement()

vi.mock('react-i18next', () => ({
  useTranslation: (namespace: string, options?: { keyPrefix?: string }) => ({
    t: (key: string) => {
      const keyPrefix = options?.keyPrefix || ''
      return `${namespace}.${keyPrefix ? `${keyPrefix}.` : ''}${key}`
    },
    i18n: {
      language: 'it',
      changeLanguage: vi.fn(),
    },
  }),
  Trans: ({ children }: { children: React.ReactNode }) => children,
}))

const mockDownloadSignedContract = vi.fn()

vi.mock('@/api/agreement', () => ({
  AgreementDownloads: {
    useDownloadSignedContract: () => mockDownloadSignedContract,
  },
}))

function mockUseProviderAgreementDetailsContext(agreement = agreementMock) {
  return vi
    .spyOn(ProviderAgreementDetailsContext, 'useProviderAgreementDetailsContext')
    .mockReturnValue({
      agreement,
      descriptorAttributes: {
        certified: [],
        declared: [],
        verified: [],
      },
    })
}

describe('ProviderAgreementDetailsGeneralInfoSection', () => {
  it('should disable download of signed agreement if document is not ready yet', () => {
    mockUseProviderAgreementDetailsContext()
    const screen = renderWithApplicationContext(<ProviderAgreementDetailsGeneralInfoSection />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    const downloadButton = screen.getByRole('button', {
      name: /agreement.providerRead.sections.generalInformations.documentation.link.label/i,
    })

    expect(downloadButton).toBeDisabled()
    fireEvent.click(downloadButton)
    expect(mockDownloadSignedContract).not.toHaveBeenCalled()
  })

  it('should be available download of signed agreement if document is ready', () => {
    mockUseProviderAgreementDetailsContext({ ...agreementMock, isDocumentReady: true })
    const screen = renderWithApplicationContext(<ProviderAgreementDetailsGeneralInfoSection />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    const downloadButton = screen.getByRole('button', {
      name: /agreement.providerRead.sections.generalInformations.documentation.link.label/i,
    })

    expect(downloadButton).toBeEnabled()
  })

  it('should download signed document when clicking download button', () => {
    mockUseProviderAgreementDetailsContext({ ...agreementMock, isDocumentReady: true })
    const screen = renderWithApplicationContext(<ProviderAgreementDetailsGeneralInfoSection />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    const downloadButton = screen.getByTestId('download-agreement-document-button')

    fireEvent.click(downloadButton)
    expect(mockDownloadSignedContract).toHaveBeenCalledOnce()
  })
})
