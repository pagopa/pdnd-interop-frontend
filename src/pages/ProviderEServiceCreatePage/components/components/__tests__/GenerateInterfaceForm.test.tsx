import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { GenerateInterfaceForm } from '../GenerateInterfaceForm'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { useForm } from 'react-hook-form'
import { PageContainer } from '@/components/layout/containers'
import { usePageContainerFormDirtyState } from '@/hooks/usePageContainerFormDirtyState'
import {
  createMockEServiceDescriptorProviderWithTemplateRef,
  mockUseEServiceCreateContext,
} from '@/../__mocks__/data/eservice.mocks'

const deleteAndUpdateRESTInfo = vi.fn()
const deleteAndUpdateSOAPInfo = vi.fn()

vi.mock('@/api/eservice', () => ({
  EServiceMutations: {
    useDeleteAndUpdateEServiceInterfaceRESTInfo: () => ({ mutate: deleteAndUpdateRESTInfo }),
    useDeleteAndUpdateEServiceInterfaceSOAPInfo: () => ({ mutate: deleteAndUpdateSOAPInfo }),
  },
}))

vi.mock('@/api/eserviceTemplate/eserviceTemplate.downloads', () => ({
  EServiceTemplateDownloads: {
    useDownloadVersionDocument: () => vi.fn(),
  },
}))

afterEach(() => {
  vi.clearAllMocks()
})

describe('GenerateInterfaceForm', () => {
  it('should render the download button, server URL field, add button, and save button', () => {
    mockUseEServiceCreateContext({
      descriptor: createMockEServiceDescriptorProviderWithTemplateRef(),
    })
    renderWithApplicationContext(<GenerateInterfaceForm />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('description.download')).toBeInTheDocument()
    expect(screen.getByLabelText(/serverSection.label/)).toBeInTheDocument()
    expect(screen.getByText('serverSection.add')).toBeInTheDocument()
    expect(screen.getByText('save')).toBeInTheDocument()
  })

  it('should show REST contact fields when technology is REST', () => {
    mockUseEServiceCreateContext({
      descriptor: createMockEServiceDescriptorProviderWithTemplateRef(),
    })
    renderWithApplicationContext(<GenerateInterfaceForm />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('contactSection.title')).toBeInTheDocument()
    expect(screen.getByLabelText(/contactSection.contactNameField/)).toBeInTheDocument()
    expect(screen.getByLabelText(/contactSection.emailField/)).toBeInTheDocument()
    expect(screen.getByLabelText(/contactSection.urlField/)).toBeInTheDocument()
    expect(screen.getByText('termsAndConditions.title')).toBeInTheDocument()
  })

  it('should not show REST contact fields when technology is SOAP', () => {
    mockUseEServiceCreateContext({
      descriptor: createMockEServiceDescriptorProviderWithTemplateRef({
        eservice: {
          description: 'Lorem ipsum',
          descriptors: [],
          producer: { id: 'org-id', tenantKind: 'PA' },
          id: 'eservice-id',
          name: 'Test',
          technology: 'SOAP',
          mode: 'DELIVER',
          riskAnalysis: [],
        },
      }),
    })
    renderWithApplicationContext(<GenerateInterfaceForm />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.queryByText('contactSection.title')).not.toBeInTheDocument()
  })

  it('should show the server section title and the URL description field when technology is SOAP', () => {
    mockUseEServiceCreateContext({
      descriptor: createMockEServiceDescriptorProviderWithTemplateRef({
        eservice: {
          description: 'Lorem ipsum',
          descriptors: [],
          producer: { id: 'org-id', tenantKind: 'PA' },
          id: 'eservice-id',
          name: 'Test',
          technology: 'SOAP',
          mode: 'DELIVER',
          riskAnalysis: [],
        },
      }),
    })
    renderWithApplicationContext(<GenerateInterfaceForm />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('serverSection.title')).toBeInTheDocument()
    expect(screen.getByLabelText(/serverSection.descriptionLabel/)).toBeInTheDocument()
  })

  it('should render the server URL description field when technology is REST', () => {
    mockUseEServiceCreateContext({
      descriptor: createMockEServiceDescriptorProviderWithTemplateRef(),
    })
    renderWithApplicationContext(<GenerateInterfaceForm />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByLabelText(/serverSection.descriptionLabel/)).toBeInTheDocument()
  })

  it('should include the server URL description in the payload when filled', async () => {
    mockUseEServiceCreateContext({
      descriptor: createMockEServiceDescriptorProviderWithTemplateRef(),
    })
    renderWithApplicationContext(<GenerateInterfaceForm />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    await userEvent.type(screen.getByLabelText(/contactSection.contactNameField/), 'John')
    await userEvent.type(screen.getByLabelText(/contactSection.emailField/), 'john@test.com')
    await userEvent.type(screen.getByLabelText(/serverSection.label/), 'https://api.test.com')
    await userEvent.type(
      screen.getByLabelText(/serverSection.descriptionLabel/),
      'Production environment'
    )

    await userEvent.click(screen.getByText('save'))

    await waitFor(() => {
      expect(deleteAndUpdateRESTInfo).toHaveBeenCalledWith(
        expect.objectContaining({
          serverUrls: [{ url: 'https://api.test.com', description: 'Production environment' }],
        }),
        expect.objectContaining({ onSuccess: expect.any(Function) })
      )
    })
  })

  it('should omit the server URL description from the payload when empty', async () => {
    mockUseEServiceCreateContext({
      descriptor: createMockEServiceDescriptorProviderWithTemplateRef(),
    })
    renderWithApplicationContext(<GenerateInterfaceForm />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    await userEvent.type(screen.getByLabelText(/contactSection.contactNameField/), 'John')
    await userEvent.type(screen.getByLabelText(/contactSection.emailField/), 'john@test.com')
    await userEvent.type(screen.getByLabelText(/serverSection.label/), 'https://api.test.com')

    await userEvent.click(screen.getByText('save'))

    await waitFor(() => {
      expect(deleteAndUpdateRESTInfo).toHaveBeenCalledWith(
        expect.objectContaining({ serverUrls: [{ url: 'https://api.test.com' }] }),
        expect.objectContaining({ onSuccess: expect.any(Function) })
      )
    })
  })

  it('should show a min-length error and not submit when the description is shorter than 10 characters', async () => {
    mockUseEServiceCreateContext({
      descriptor: createMockEServiceDescriptorProviderWithTemplateRef(),
    })
    renderWithApplicationContext(<GenerateInterfaceForm />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    await userEvent.type(screen.getByLabelText(/contactSection.contactNameField/), 'John')
    await userEvent.type(screen.getByLabelText(/contactSection.emailField/), 'john@test.com')
    await userEvent.type(screen.getByLabelText(/serverSection.label/), 'https://api.test.com')
    await userEvent.type(screen.getByLabelText(/serverSection.descriptionLabel/), 'short')

    await userEvent.click(screen.getByText('save'))

    expect(await screen.findByText('validation.string.minLength')).toBeInTheDocument()
    expect(deleteAndUpdateRESTInfo).not.toHaveBeenCalled()
  })

  it('should add a new server URL field when add button is clicked', async () => {
    mockUseEServiceCreateContext({
      descriptor: createMockEServiceDescriptorProviderWithTemplateRef(),
    })
    renderWithApplicationContext(<GenerateInterfaceForm />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    const addButton = screen.getByText('serverSection.add')
    await userEvent.click(addButton)

    const urlFields = screen.getAllByLabelText(/serverSection.label/)
    expect(urlFields.length).toBe(2)
  })

  it('should not show the per-server counter or a remove button when there is a single server URL', () => {
    mockUseEServiceCreateContext({
      descriptor: createMockEServiceDescriptorProviderWithTemplateRef(),
    })
    renderWithApplicationContext(<GenerateInterfaceForm />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('serverSection.title')).toBeInTheDocument()
    expect(screen.queryByText('serverSection.counter')).not.toBeInTheDocument()
    expect(screen.queryByText('serverSection.removeServer')).not.toBeInTheDocument()
  })

  it('should show a counter and a remove button for every server when there is more than one', async () => {
    mockUseEServiceCreateContext({
      descriptor: createMockEServiceDescriptorProviderWithTemplateRef(),
    })
    renderWithApplicationContext(<GenerateInterfaceForm />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    await userEvent.click(screen.getByText('serverSection.add'))

    expect(screen.getAllByText('serverSection.counter')).toHaveLength(2)
    expect(screen.getAllByText('serverSection.removeServer')).toHaveLength(2)
    expect(screen.queryByText('serverSection.title')).not.toBeInTheDocument()
  })

  it('should remove a server URL and restore the single-server layout when a remove button is clicked', async () => {
    mockUseEServiceCreateContext({
      descriptor: createMockEServiceDescriptorProviderWithTemplateRef(),
    })
    renderWithApplicationContext(<GenerateInterfaceForm />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    await userEvent.click(screen.getByText('serverSection.add'))
    expect(screen.getAllByLabelText(/serverSection.label/)).toHaveLength(2)

    await userEvent.click(screen.getAllByText('serverSection.removeServer')[1])

    expect(screen.getAllByLabelText(/serverSection.label/)).toHaveLength(1)
    expect(screen.queryByText('serverSection.removeServer')).not.toBeInTheDocument()
    expect(screen.getByText('serverSection.title')).toBeInTheDocument()
  })

  it('should render a single empty server URL field when the descriptor has no server URLs', () => {
    mockUseEServiceCreateContext({
      descriptor: createMockEServiceDescriptorProviderWithTemplateRef({ serverUrls: [] }),
    })
    renderWithApplicationContext(<GenerateInterfaceForm />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getAllByLabelText(/serverSection.label/)).toHaveLength(1)
    expect(screen.getByText('serverSection.title')).toBeInTheDocument()
    expect(screen.queryByText('serverSection.removeServer')).not.toBeInTheDocument()
  })

  it('should call REST mutation on submit when technology is REST', async () => {
    mockUseEServiceCreateContext({
      descriptor: createMockEServiceDescriptorProviderWithTemplateRef(),
    })
    renderWithApplicationContext(<GenerateInterfaceForm />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    await userEvent.type(screen.getByLabelText(/contactSection.contactNameField/), 'John')
    await userEvent.type(screen.getByLabelText(/contactSection.emailField/), 'john@test.com')
    await userEvent.type(screen.getByLabelText(/serverSection.label/), 'https://api.test.com')

    await userEvent.click(screen.getByText('save'))

    await waitFor(() => {
      expect(deleteAndUpdateRESTInfo).toHaveBeenCalled()
    })
    expect(deleteAndUpdateSOAPInfo).not.toHaveBeenCalled()
  })

  it('should call SOAP mutation on submit when technology is SOAP', async () => {
    mockUseEServiceCreateContext({
      descriptor: createMockEServiceDescriptorProviderWithTemplateRef({
        eservice: {
          description: 'Lorem ipsum',
          descriptors: [],
          producer: { id: 'org-id', tenantKind: 'PA' },
          id: 'eservice-id',
          name: 'Test',
          technology: 'SOAP',
          mode: 'DELIVER',
          riskAnalysis: [],
        },
      }),
    })
    renderWithApplicationContext(<GenerateInterfaceForm />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    await userEvent.type(screen.getByLabelText(/serverSection.label/), 'https://api.test.com')
    await userEvent.click(screen.getByText('save'))

    await waitFor(() => {
      expect(deleteAndUpdateSOAPInfo).toHaveBeenCalled()
    })
    expect(deleteAndUpdateRESTInfo).not.toHaveBeenCalled()
  })

  describe('PageContainer unsaved changes', () => {
    const exitDialog = { name: 'exitDialog.title' }

    // Clean outer owner registered on the same step, like EServiceCreateStepTechSpec
    const CleanOuterForm = () => {
      const methods = useForm({ defaultValues: { voucherLifespan: 1 } })
      usePageContainerFormDirtyState(methods.control)
      return null
    }

    const renderInWizard = () => {
      mockUseEServiceCreateContext({
        descriptor: createMockEServiceDescriptorProviderWithTemplateRef(),
      })
      return renderWithApplicationContext(
        // Prevents the exit link from navigating so the prompt state can be asserted repeatedly
        <div
          onClickCapture={(event) => {
            if ((event.target as Element).closest('a')) event.preventDefault()
          }}
        >
          <PageContainer navigation={{ mode: 'wizard', exitAction: { to: 'DEFAULT' } }}>
            <CleanOuterForm />
            <GenerateInterfaceForm />
          </PageContainer>
        </div>,
        { withReactQueryContext: true, withRouterContext: true, withDialogContext: true }
      )
    }

    it('does not prompt on exit when the interface metadata is untouched', async () => {
      renderInWizard()

      await userEvent.click(screen.getByRole('link', { name: 'exitButton' }))

      expect(screen.queryByRole('dialog', exitDialog)).not.toBeInTheDocument()
    })

    it('prompts on exit for an interface-only metadata edit and keeps it on cancel', async () => {
      renderInWizard()

      const contactName = screen.getByLabelText(/contactSection.contactNameField/)
      await userEvent.type(contactName, 'John')
      await userEvent.click(screen.getByRole('link', { name: 'exitButton' }))

      expect(screen.getByRole('dialog', exitDialog)).toBeInTheDocument()

      await userEvent.click(screen.getByRole('button', { name: 'exitDialog.cancelButton' }))
      await waitFor(() => expect(screen.queryByRole('dialog', exitDialog)).not.toBeInTheDocument())
      expect(contactName).toHaveValue('John')

      await userEvent.click(screen.getByRole('link', { name: 'exitButton' }))
      expect(screen.getByRole('dialog', exitDialog)).toBeInTheDocument()
    })

    it('prompts on exit after adding a server URL entry only', async () => {
      renderInWizard()

      await userEvent.click(screen.getByText('serverSection.add'))
      await userEvent.click(screen.getByRole('link', { name: 'exitButton' }))

      expect(screen.getByRole('dialog', exitDialog)).toBeInTheDocument()
    })

    it('does not prompt on exit after reverting an interface metadata edit', async () => {
      renderInWizard()

      const contactName = screen.getByLabelText(/contactSection.contactNameField/)
      const initialValue = (contactName as HTMLInputElement).value
      await userEvent.type(contactName, 'John')
      await userEvent.clear(contactName)
      if (initialValue) await userEvent.type(contactName, initialValue)
      await userEvent.click(screen.getByRole('link', { name: 'exitButton' }))

      expect(screen.queryByRole('dialog', exitDialog)).not.toBeInTheDocument()
    })

    it('does not prompt on exit once the interface metadata has been saved', async () => {
      deleteAndUpdateRESTInfo.mockImplementationOnce(
        (_payload: unknown, options?: { onSuccess?: VoidFunction }) => options?.onSuccess?.()
      )
      renderInWizard()

      await userEvent.type(screen.getByLabelText(/contactSection.contactNameField/), 'John')
      await userEvent.type(screen.getByLabelText(/contactSection.emailField/), 'john@test.com')
      await userEvent.type(screen.getByLabelText(/serverSection.label/), 'https://api.test.com')
      await userEvent.click(screen.getByText('save'))
      await waitFor(() => expect(deleteAndUpdateRESTInfo).toHaveBeenCalled())

      await userEvent.click(screen.getByRole('link', { name: 'exitButton' }))

      expect(screen.queryByRole('dialog', exitDialog)).not.toBeInTheDocument()
    })
  })
})
