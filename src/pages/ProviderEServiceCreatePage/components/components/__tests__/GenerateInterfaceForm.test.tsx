import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { GenerateInterfaceForm } from '../GenerateInterfaceForm'
import { renderWithApplicationContext } from '@/utils/testing.utils'
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
        })
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
        expect.objectContaining({ serverUrls: [{ url: 'https://api.test.com' }] })
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
})
