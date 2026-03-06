import React from 'react'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import { ProviderEServiceUpdateDelegationFlagsDrawer } from '../components/ProviderEServiceDetailsTab/ProviderEServiceTechnicalInfoSection/ProviderEServiceUpdateDelegationFlagsDrawer'
import { createMockEServiceDescriptorProvider } from '@/../__mocks__/data/eservice.mocks'

//--- Mocks ---

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

const mockUpdateDelegationFlags = vi.fn()
vi.mock('@/api/eservice', () => ({
  EServiceMutations: {
    useUpdateEServiceDelegationFlagsAfterPublication: () => ({
      mutate: mockUpdateDelegationFlags,
    }),
  },
}))

vi.mock('@/api/auth', () => ({
  AuthHooks: {
    useJwt: vi.fn(() => ({ isAdmin: true })),
  },
}))

const descriptorMock = createMockEServiceDescriptorProvider({
  eservice: {
    id: 'test-eservice-id',
    isConsumerDelegable: false,
    isClientAccessDelegable: false,
  },
})

describe('ProviderEServiceUpdateDelegationFlagsDrawer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseJwt({ isAdmin: true })
  })

  describe('Rendering', () => {
    it('should render drawer with correct texts when isOpen is true', () => {
      renderWithApplicationContext(
        <ProviderEServiceUpdateDelegationFlagsDrawer
          isOpen={true}
          onClose={vi.fn()}
          descriptor={descriptorMock}
        />,
        { withReactQueryContext: true }
      )

      expect(screen.getByText('updateDelegationsDrawer.title')).toBeInTheDocument()
      expect(screen.getByText('updateDelegationsDrawer.subtitle')).toBeInTheDocument()
      expect(
        screen.getByText('updateDelegationsDrawer.isConsumerDelegableField.label')
      ).toBeInTheDocument()
    })

    it('should display an alert if the user is not an admin', () => {
      mockUseJwt({ isAdmin: false })

      renderWithApplicationContext(
        <ProviderEServiceUpdateDelegationFlagsDrawer
          isOpen={true}
          onClose={vi.fn()}
          descriptor={descriptorMock}
        />,
        { withReactQueryContext: true }
      )

      expect(screen.getByText('updateDelegationsDrawer.alert')).toBeInTheDocument()
    })
  })

  describe('Form Submission Logic', () => {
    it('should submit correct values when toggling delegations', async () => {
      const onCloseMock = vi.fn()
      const user = userEvent.setup()

      renderWithApplicationContext(
        <ProviderEServiceUpdateDelegationFlagsDrawer
          isOpen={true}
          onClose={onCloseMock}
          descriptor={descriptorMock}
        />,
        { withReactQueryContext: true }
      )

      const consumerSwitch = screen.getByRole('checkbox', {
        name: /updateDelegationsDrawer\.isConsumerDelegableField\.switchLabel/i,
      })
      await user.click(consumerSwitch)

      const clientAccessCheckbox = await screen.findByRole('checkbox', {
        name: /updateDelegationsDrawer\.isClientAccessDelegableField\.checkboxLabel/i,
      })
      await user.click(clientAccessCheckbox)

      const saveButton = screen.getByRole('button', { name: 'common.actions.saveEdits' })
      await user.click(saveButton)

      await waitFor(() => {
        expect(mockUpdateDelegationFlags).toHaveBeenCalledWith(
          {
            eserviceId: 'test-eservice-id',
            isConsumerDelegable: true,
            isClientAccessDelegable: true,
          },
          expect.any(Object)
        )
      })
    })

    it('should override isClientAccessDelegable to false if isConsumerDelegable is false', async () => {
      const user = userEvent.setup()

      // Testing the edge case in onSubmit function
      const edgeCaseDescriptor = createMockEServiceDescriptorProvider({
        eservice: {
          id: 'edge-case-id',
          isConsumerDelegable: false,
          isClientAccessDelegable: true,
        },
      })

      renderWithApplicationContext(
        <ProviderEServiceUpdateDelegationFlagsDrawer
          isOpen={true}
          onClose={vi.fn()}
          descriptor={edgeCaseDescriptor}
        />,
        { withReactQueryContext: true }
      )

      const saveButton = screen.getByRole('button', { name: 'common.actions.saveEdits' })
      await user.click(saveButton)

      await waitFor(() => {
        expect(mockUpdateDelegationFlags).toHaveBeenCalledWith(
          {
            eserviceId: 'edge-case-id',
            isConsumerDelegable: false,
            isClientAccessDelegable: false,
          },
          expect.any(Object)
        )
      })
    })
  })
})
