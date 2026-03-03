import type { Mock } from 'vitest'
import { it, expect, beforeEach, vi } from 'vitest'
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useGetProducerDelegationUserRole } from '@/hooks/useGetProducerDelegationUserRole'
import { createMockEServiceDescriptorProvider } from '@/../__mocks__/data/eservice.mocks'
import { ProviderEServiceDelegationsSection } from '../components/ProviderEServiceDetailsTab/ProviderEServiceTechnicalInfoSection/ProviderEServiceDelegationsSection'
import { AuthHooks } from '@/api/auth'

vi.mock('@/hooks/useGetProducerDelegationUserRole')
vi.mock('@/api/auth/auth.hooks', () => ({
  AuthHooks: {
    useJwt: vi.fn(),
  },
}))

vi.mock(
  '../components/ProviderEServiceDetailsTab/ProviderEServiceTechnicalInfoSection/ProviderEServiceUpdateDelegationFlagsDrawer',
  () => ({
    ProviderEServiceUpdateDelegationFlagsDrawer: ({ isOpen }: { isOpen: boolean }) => (
      <div data-testid="drawer">{isOpen ? 'Drawer is Open' : 'Drawer is Closed'}</div>
    ),
  })
)

vi.mock('react-i18next', () => ({
  useTranslation: (namespace: string, options?: { keyPrefix?: string }) => ({
    t: (key: string) => {
      if (options?.keyPrefix) {
        const prefix = options.keyPrefix.split('.').pop()
        return `${prefix}.${key}`
      }
      return `${namespace}.${key}`
    },
  }),
  Trans: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  })

const descriptorMock = createMockEServiceDescriptorProvider({
  eservice: {
    id: 'test-eservice-id',
    isConsumerDelegable: true,
    isClientAccessDelegable: false,
  },
})

let queryClient: QueryClient

beforeEach(() => {
  vi.clearAllMocks()

  queryClient = createTestQueryClient()
  ;(AuthHooks.useJwt as Mock).mockReturnValue({
    jwt: { organizationId: 'test-org-id' },
  })
})

const renderWithClient = (ui: React.ReactElement) => {
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>)
}

it('renders the delegation flags correctly', () => {
  ;(useGetProducerDelegationUserRole as Mock).mockReturnValue({
    isDelegator: true,
  })

  renderWithClient(<ProviderEServiceDelegationsSection descriptor={descriptorMock} />)

  expect(screen.getByText('delegationSection.isConsumerDelegable.label')).toBeInTheDocument()
  expect(screen.getByText('delegationSection.isConsumerDelegable.value.true')).toBeInTheDocument()
  expect(screen.getByText('delegationSection.isClientAccessDelegable.label')).toBeInTheDocument()
  expect(
    screen.getByText('delegationSection.isClientAccessDelegable.value.false')
  ).toBeInTheDocument()
})

it('hides the edit button when the user is a delegator', () => {
  ;(useGetProducerDelegationUserRole as Mock).mockReturnValue({
    isDelegator: true,
  })

  renderWithClient(<ProviderEServiceDelegationsSection descriptor={descriptorMock} />)

  expect(screen.queryByText('actions.edit')).not.toBeInTheDocument()
})

it('shows the edit button and opens the drawer when the user is not a delegator', () => {
  ;(useGetProducerDelegationUserRole as Mock).mockReturnValue({
    isDelegator: false,
  })

  renderWithClient(<ProviderEServiceDelegationsSection descriptor={descriptorMock} />)

  expect(screen.getByTestId('drawer')).toHaveTextContent('Drawer is Closed')

  const editButton = screen.getByText('common.actions.edit')
  expect(editButton).toBeInTheDocument()

  fireEvent.click(editButton)

  expect(screen.getByTestId('drawer')).toHaveTextContent('Drawer is Open')
})
