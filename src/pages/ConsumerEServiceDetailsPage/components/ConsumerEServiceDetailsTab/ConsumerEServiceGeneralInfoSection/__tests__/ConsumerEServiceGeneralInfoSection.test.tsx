import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitForElementToBeRemoved } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ConsumerEServiceGeneralInfoSection } from '../ConsumerEServiceGeneralInfoSection'
import {
  mockUseCurrentRoute,
  mockUseParams,
  renderWithApplicationContext,
} from '@/utils/testing.utils'
import {
  createMockEServiceDescriptorCatalog,
  createMockEServiceDescriptorCatalogAsync,
} from '@/../__mocks__/data/eservice.mocks'

mockUseParams({
  eserviceId: 'eservice-id-001',
  descriptorId: 'descriptor-id-001',
})

mockUseCurrentRoute({ mode: 'consumer' })

const useSuspenseQueryMock = vi.fn()
const downloadDocumentMock = vi.fn()

vi.mock('@tanstack/react-query', async (importOriginal) => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const actual = await importOriginal<typeof import('@tanstack/react-query')>()
  return {
    ...actual,
    useSuspenseQuery: () => useSuspenseQueryMock(),
  }
})

vi.mock('@/api/eservice', () => ({
  EServiceQueries: {
    getDescriptorCatalog: (id: string, descriptorId: string) => [
      'eservice',
      'catalog',
      id,
      descriptorId,
    ],
  },
  EServiceDownloads: {
    useDownloadVersionDocument: () => downloadDocumentMock,
  },
}))

function renderComponent() {
  return renderWithApplicationContext(<ConsumerEServiceGeneralInfoSection />, {
    withReactQueryContext: true,
    withRouterContext: true,
  })
}

describe('ConsumerEServiceGeneralInfoSection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('does not render async exchange details action for synchronous eservices', () => {
    useSuspenseQueryMock.mockReturnValue({ data: createMockEServiceDescriptorCatalog() })

    renderComponent()

    expect(
      screen.queryByRole('button', {
        name: 'bottomActions.showAsyncExchangeDetails',
      })
    ).not.toBeInTheDocument()
  })

  it('renders async exchange details action for asynchronous eservices', () => {
    useSuspenseQueryMock.mockReturnValue({ data: createMockEServiceDescriptorCatalogAsync() })

    renderComponent()

    expect(
      screen.getByRole('button', {
        name: 'bottomActions.showAsyncExchangeDetails',
      })
    ).toBeInTheDocument()
  })

  it('renders exchange type for synchronous eservices', () => {
    useSuspenseQueryMock.mockReturnValue({ data: createMockEServiceDescriptorCatalog() })

    renderComponent()

    expect(screen.getByText('exchangeType.label')).toBeInTheDocument()
    expect(screen.getByText('exchangeType.value.sync')).toBeInTheDocument()
  })

  it('renders exchange type for asynchronous eservices', () => {
    useSuspenseQueryMock.mockReturnValue({ data: createMockEServiceDescriptorCatalogAsync() })

    renderComponent()

    expect(screen.getByText('exchangeType.label')).toBeInTheDocument()
    expect(screen.getByText('exchangeType.value.async')).toBeInTheDocument()
  })

  it('opens async exchange details drawer from the async action', async () => {
    const user = userEvent.setup()
    useSuspenseQueryMock.mockReturnValue({ data: createMockEServiceDescriptorCatalogAsync() })

    renderComponent()

    await user.click(
      screen.getByRole('button', {
        name: 'bottomActions.showAsyncExchangeDetails',
      })
    )

    expect(screen.getByText('responseTime')).toBeInTheDocument()
    expect(screen.getByText('callbackInterface')).toBeInTheDocument()
  })

  it('closes async exchange details drawer from the close button', async () => {
    const user = userEvent.setup()
    useSuspenseQueryMock.mockReturnValue({ data: createMockEServiceDescriptorCatalogAsync() })

    renderComponent()

    await user.click(
      screen.getByRole('button', {
        name: 'bottomActions.showAsyncExchangeDetails',
      })
    )

    expect(screen.getByText('responseTime')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'closeIconAriaLabel' }))

    await waitForElementToBeRemoved(() => screen.queryByText('responseTime'))
  })

  it('does not show async exchange information in the technical details drawer for synchronous eservices', async () => {
    const user = userEvent.setup()
    useSuspenseQueryMock.mockReturnValue({ data: createMockEServiceDescriptorCatalog() })

    renderComponent()

    await user.click(
      screen.getByRole('button', {
        name: 'bottomActions.showTechnicalDetails',
      })
    )

    expect(screen.queryByText('asyncExchange.label')).not.toBeInTheDocument()
    expect(screen.queryByText('asyncExchangeCallbackInterface')).not.toBeInTheDocument()
  })

  it('shows async exchange information in the technical details drawer for asynchronous eservices', async () => {
    const user = userEvent.setup()
    useSuspenseQueryMock.mockReturnValue({ data: createMockEServiceDescriptorCatalogAsync() })

    renderComponent()

    await user.click(
      screen.getByRole('button', {
        name: 'bottomActions.showTechnicalDetails',
      })
    )

    expect(screen.getByText('asyncExchange.label')).toBeInTheDocument()
    expect(screen.getByText('asyncExchange.value.true')).toBeInTheDocument()
    expect(screen.getByText('asyncExchangeCallbackInterface')).toBeInTheDocument()
    expect(screen.getByText('Specifica callback')).toBeInTheDocument()
  })

  it('shows the delegation subsection with the delegation flags', () => {
    useSuspenseQueryMock.mockReturnValue({
      data: createMockEServiceDescriptorCatalog({
        eservice: { isConsumerDelegable: true, isClientAccessDelegable: false },
      }),
    })

    renderComponent()

    expect(screen.getByText('delegationSection.title')).toBeInTheDocument()
    expect(screen.getByText('delegationSection.isConsumerDelegable.label')).toBeInTheDocument()
    expect(screen.getByText('delegationSection.isConsumerDelegable.value.true')).toBeInTheDocument()
    expect(screen.getByText('delegationSection.isClientAccessDelegable.label')).toBeInTheDocument()
    expect(
      screen.getByText('delegationSection.isClientAccessDelegable.value.false')
    ).toBeInTheDocument()
  })

  it('does not show the template reference for an e-service not derived from a template', () => {
    useSuspenseQueryMock.mockReturnValue({ data: createMockEServiceDescriptorCatalog() })

    renderComponent()

    expect(screen.queryByText('eserviceTemplateInUse.label')).not.toBeInTheDocument()
  })

  it('shows the template reference link for an e-service derived from a template', () => {
    useSuspenseQueryMock.mockReturnValue({
      data: createMockEServiceDescriptorCatalog({
        templateRef: {
          templateId: 'template-id-001',
          templateVersionId: 'template-version-id-001',
          templateName: 'My template',
        },
      }),
    })

    renderComponent()

    expect(screen.getByText('eserviceTemplateInUse.label')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'My template' })).toBeInTheDocument()
  })
})
