import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import { createMockPurpose } from '../../../../../__mocks__/data/purpose.mocks'
import { ConsumerPurposeDetailsGeneralInfoSection } from '../PurposeDetailsTab/ConsumerPurposeDetailsGeneralInfoSection'
import { fireEvent, waitFor, waitForElementToBeRemoved } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { type Purpose } from '@/api/api.generatedTypes'

const purpose = createMockPurpose()

const downloadSignedRiskAnalysisMock = vi.fn()
const patchUpdatePurposeMock = vi.fn()
const usePatchUpdatePurposeMock = vi.fn<
  (options: { isReceive: boolean }) => { mutate: typeof patchUpdatePurposeMock }
>(() => ({ mutate: patchUpdatePurposeMock }))

mockUseJwt()

vi.mock('@/api/purpose', () => ({
  PurposeMutations: {
    usePatchUpdatePurpose: (options: { isReceive: boolean }) => usePatchUpdatePurposeMock(options),
  },
  PurposeDownloads: {
    useDownloadSignedRiskAnalysis: () => downloadSignedRiskAnalysisMock,
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
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseJwt()
  })

  describe.each(['DELIVER', 'RECEIVE'] as const)('metadata $mode', (mode) => {
    it.each([
      {
        name: 'Updated purpose',
        description: 'Existing purpose description',
        fields: { title: 'Updated purpose' },
      },
      {
        name: 'Existing purpose',
        description: 'Updated purpose description',
        fields: { description: 'Updated purpose description' },
      },
      {
        name: 'Updated purpose',
        description: 'Updated purpose description',
        fields: { title: 'Updated purpose', description: 'Updated purpose description' },
      },
    ])('submits only changed fields: $fields', async ({ name, description, fields }) => {
      const user = userEvent.setup()
      const metadataPurpose = createMockPurpose({
        title: 'Existing purpose',
        description: 'Existing purpose description',
        eservice: { mode },
      })
      patchUpdatePurposeMock.mockImplementationOnce(
        (_payload: unknown, options: { onSuccess: () => void }) => options.onSuccess()
      )
      const screen = renderWithApplicationContext(
        <ConsumerPurposeDetailsGeneralInfoSection purpose={metadataPurpose} />,
        { withReactQueryContext: true, withRouterContext: true }
      )
      await user.click(
        screen.getByRole('button', {
          name: 'purpose.consumerView.sections.generalInformations.nameAndDescription.edit',
        })
      )
      const nameInput = screen.getByRole('textbox', {
        name: 'purpose.consumerView.sections.generalInformations.updateMetadataDrawer.nameField.label',
      })
      if (name !== metadataPurpose.title) {
        await user.clear(nameInput)
        await user.type(nameInput, name)
      }
      if (description !== metadataPurpose.description) {
        const descriptionInput = screen.getByRole('textbox', {
          name: 'purpose.consumerView.sections.generalInformations.updateMetadataDrawer.descriptionField.label',
        })
        await user.clear(descriptionInput)
        await user.type(descriptionInput, description)
      }
      await user.click(screen.getByRole('button', { name: 'common.actions.saveEdits' }))

      await waitFor(() =>
        expect(patchUpdatePurposeMock).toHaveBeenCalledWith(
          { purposeId: metadataPurpose.id, ...fields },
          { onSuccess: expect.any(Function) }
        )
      )
      expect(usePatchUpdatePurposeMock).toHaveBeenCalledWith({ isReceive: mode === 'RECEIVE' })
      await waitForElementToBeRemoved(nameInput)
    })

    it('closes without submitting unchanged metadata', async () => {
      const user = userEvent.setup()
      const metadataPurpose = createMockPurpose({
        title: 'Existing purpose',
        description: 'Existing purpose description',
        eservice: { mode },
      })
      const screen = renderWithApplicationContext(
        <ConsumerPurposeDetailsGeneralInfoSection purpose={metadataPurpose} />,
        { withReactQueryContext: true, withRouterContext: true }
      )
      await user.click(
        screen.getByRole('button', {
          name: 'purpose.consumerView.sections.generalInformations.nameAndDescription.edit',
        })
      )
      const nameInput = screen.getByRole('textbox', {
        name: 'purpose.consumerView.sections.generalInformations.updateMetadataDrawer.nameField.label',
      })
      const saveButton = screen.getByRole('button', { name: 'common.actions.saveEdits' })
      expect(saveButton).toBeEnabled()
      await user.click(saveButton)

      await waitForElementToBeRemoved(nameInput)
      expect(patchUpdatePurposeMock).not.toHaveBeenCalled()
    })
  })

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
      name: 'purpose.consumerView.sections.generalInformations.specifications.eServiceField.value',
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

  it('should download signed riskAnalysis document when clicking download button', () => {
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

  it('should display consumer and delegated consumer when delegation exists', () => {
    const purposeWithDelegation: Purpose = createMockPurpose({
      delegation: {
        id: 'delegation-id',
        delegator: { id: 'delegator-id', name: 'Delegator Name' },
        delegate: { id: 'delegate-id', name: 'Delegated Consumer Name' },
      },
      consumer: { id: 'consumer-id', name: 'Consumer Name' },
    })

    const screen = renderWithApplicationContext(
      <ConsumerPurposeDetailsGeneralInfoSection purpose={purposeWithDelegation} />,
      { withReactQueryContext: true, withRouterContext: true }
    )

    expect(
      screen.getByText('purpose.consumerView.sections.generalInformations.consumerField.label')
    ).toBeInTheDocument()
    expect(screen.getByText('Consumer Name')).toBeInTheDocument()
    expect(
      screen.getByText(
        'purpose.consumerView.sections.generalInformations.delegatedConsumerField.label'
      )
    ).toBeInTheDocument()
    expect(screen.getByText('Delegated Consumer Name')).toBeInTheDocument()
  })
  it('should not display delegation fields when delegation is missing', () => {
    const purposeWithoutDelegation: Purpose = createMockPurpose({ delegation: undefined })

    const screen = renderWithApplicationContext(
      <ConsumerPurposeDetailsGeneralInfoSection purpose={purposeWithoutDelegation} />,
      { withReactQueryContext: true, withRouterContext: true }
    )

    expect(
      screen.queryByText('purpose.consumerView.sections.generalInformations.consumerField.label')
    ).not.toBeInTheDocument()
    expect(
      screen.queryByText(
        'purpose.consumerView.sections.generalInformations.delegatedConsumerField.label'
      )
    ).not.toBeInTheDocument()
  })
  it('should display purpose template information when purposeTemplate exists', () => {
    const purposeWithTemplate: Purpose = createMockPurpose({
      purposeTemplate: { id: 'template-id', purposeTitle: 'Purpose Template Title' },
    })

    const screen = renderWithApplicationContext(
      <ConsumerPurposeDetailsGeneralInfoSection purpose={purposeWithTemplate} />,
      { withReactQueryContext: true, withRouterContext: true }
    )

    expect(
      screen.getByText(
        'purpose.consumerView.sections.generalInformations.specifications.purposeTemplateField.label'
      )
    ).toBeInTheDocument()
    expect(screen.getByText('Purpose Template Title')).toBeInTheDocument()
  })
  it('should not display purpose template information when purposeTemplate is missing', () => {
    const purposeWithoutTemplate: Purpose = createMockPurpose({ purposeTemplate: undefined })

    const screen = renderWithApplicationContext(
      <ConsumerPurposeDetailsGeneralInfoSection purpose={purposeWithoutTemplate} />,
      { withReactQueryContext: true, withRouterContext: true }
    )

    expect(
      screen.queryByText(
        'purpose.consumerView.sections.generalInformations.specifications.purposeTemplateField.label'
      )
    ).not.toBeInTheDocument()
  })

  it('should keep metadata visible without an edit action for non-admin users', () => {
    mockUseJwt({ isAdmin: false })
    const screen = renderWithApplicationContext(
      <ConsumerPurposeDetailsGeneralInfoSection purpose={purpose} />,
      { withReactQueryContext: true, withRouterContext: true }
    )

    expect(
      screen.queryByRole('button', {
        name: 'purpose.consumerView.sections.generalInformations.nameAndDescription.edit',
      })
    ).not.toBeInTheDocument()
    expect(screen.getByText(purpose.title)).toBeVisible()
    expect(screen.getByText(purpose.description)).toBeVisible()
  })

  it('keeps metadata read-only for a delegator administrator', () => {
    mockUseJwt({ isAdmin: true, jwt: { organizationId: 'delegator-id' } })
    const delegatedPurpose = createMockPurpose({
      delegation: {
        delegator: { id: 'delegator-id' },
        delegate: { id: 'delegate-id' },
      },
    })
    const screen = renderWithApplicationContext(
      <ConsumerPurposeDetailsGeneralInfoSection purpose={delegatedPurpose} />,
      { withReactQueryContext: true, withRouterContext: true }
    )

    expect(
      screen.queryByRole('button', {
        name: 'purpose.consumerView.sections.generalInformations.nameAndDescription.edit',
      })
    ).not.toBeInTheDocument()
    expect(screen.getByText(delegatedPurpose.title)).toBeVisible()
    expect(screen.getByText(delegatedPurpose.description)).toBeVisible()
    expect(patchUpdatePurposeMock).not.toHaveBeenCalled()
  })

  it('allows a delegate administrator to edit metadata', async () => {
    mockUseJwt({ isAdmin: true, jwt: { organizationId: 'delegate-id' } })
    const delegatedPurpose = createMockPurpose({
      delegation: {
        delegator: { id: 'delegator-id' },
        delegate: { id: 'delegate-id' },
      },
    })
    const user = userEvent.setup()
    const screen = renderWithApplicationContext(
      <ConsumerPurposeDetailsGeneralInfoSection purpose={delegatedPurpose} />,
      { withReactQueryContext: true, withRouterContext: true }
    )

    await user.click(
      screen.getByRole('button', {
        name: 'purpose.consumerView.sections.generalInformations.nameAndDescription.edit',
      })
    )
    const nameInput = screen.getByRole('textbox', {
      name: 'purpose.consumerView.sections.generalInformations.updateMetadataDrawer.nameField.label',
    })
    await user.clear(nameInput)
    await user.type(nameInput, 'Updated delegated purpose')
    await user.click(screen.getByRole('button', { name: 'common.actions.saveEdits' }))

    await waitFor(() =>
      expect(patchUpdatePurposeMock).toHaveBeenCalledWith(
        { purposeId: delegatedPurpose.id, title: 'Updated delegated purpose' },
        { onSuccess: expect.any(Function) }
      )
    )
  })

  it('should show the metadata drawer with the purpose values when edit is clicked', async () => {
    const user = userEvent.setup()
    const screen = renderWithApplicationContext(
      <ConsumerPurposeDetailsGeneralInfoSection purpose={purpose} />,
      { withReactQueryContext: true, withRouterContext: true }
    )

    await user.click(
      screen.getByRole('button', {
        name: 'purpose.consumerView.sections.generalInformations.nameAndDescription.edit',
      })
    )

    expect(
      screen.getByText(
        'purpose.consumerView.sections.generalInformations.updateMetadataDrawer.title'
      )
    ).toBeInTheDocument()
    expect(
      screen.getByRole('textbox', {
        name: 'purpose.consumerView.sections.generalInformations.updateMetadataDrawer.nameField.label',
      })
    ).toHaveValue(purpose.title)
    expect(
      screen.getByRole('textbox', {
        name: 'purpose.consumerView.sections.generalInformations.updateMetadataDrawer.descriptionField.label',
      })
    ).toHaveValue(purpose.description)
  })
})
