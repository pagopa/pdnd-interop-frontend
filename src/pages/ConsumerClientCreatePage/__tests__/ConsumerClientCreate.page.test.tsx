import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useFormContext } from 'react-hook-form'

const navigateMock = vi.fn()
const createClientMock = vi.fn()
const createInteropM2MClientMock = vi.fn()
const useClientKindMock = vi.fn()

vi.mock('@/api/client', () => ({
  ClientMutations: {
    useCreate: () => ({ mutate: createClientMock }),
    useCreateInteropM2M: () => ({ mutate: createInteropM2MClientMock }),
  },
}))

vi.mock('@/hooks/useClientKind', () => ({
  useClientKind: () => useClientKindMock(),
}))

vi.mock('@/router', () => ({
  useNavigate: () => navigateMock,
}))

vi.mock('@/components/layout/containers', () => ({
  PageContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SectionContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

vi.mock('@/components/shared/react-hook-form-inputs', () => ({
  RHFTextField: ({ name, label }: { name: string; label: string }) => {
    const { register } = useFormContext()
    return <input aria-label={label} {...register(name)} />
  },
}))

vi.mock('../components/OperatorsInputTable', () => ({
  default: () => null,
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

describe('ConsumerClientCreatePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it.each([
    {
      clientKind: 'CONSUMER',
      createMock: createClientMock,
      thankYouRoute: 'SUBSCRIBE_CLIENT_CREATE_THANK_YOU',
      closeRoute: 'SUBSCRIBE_CLIENT_EDIT',
    },
    {
      clientKind: 'API',
      createMock: createInteropM2MClientMock,
      thankYouRoute: 'SUBSCRIBE_INTEROP_M2M_CLIENT_CREATE_THANK_YOU',
      closeRoute: 'SUBSCRIBE_INTEROP_M2M_CLIENT_EDIT',
    },
  ])(
    'navigates to the $clientKind client thank you page after creation',
    async ({ clientKind, createMock, thankYouRoute, closeRoute }) => {
      const user = userEvent.setup()
      useClientKindMock.mockReturnValue(clientKind)
      createMock.mockImplementationOnce(
        (_payload: unknown, { onSuccess }: { onSuccess: (data: { id: string }) => void }) => {
          onSuccess({ id: 'client-id' })
        }
      )

      const { default: ConsumerClientCreatePage } = await import('../ConsumerClientCreate.page')
      render(<ConsumerClientCreatePage />)

      await user.type(
        screen.getByRole('textbox', { name: 'create.nameField.label' }),
        'Client name'
      )
      await user.type(
        screen.getByRole('textbox', { name: 'create.descriptionField.label' }),
        'Client description'
      )
      await user.click(screen.getByRole('button', { name: 'create.actions.createLabel' }))

      expect(navigateMock).toHaveBeenCalledWith(thankYouRoute, {
        params: { clientId: 'client-id' },
        state: {
          title: 'create.thankYou.title',
          description: 'create.thankYou.description',
          buttonLabel: 'create.thankYou.action',
          closeRouteKey: closeRoute,
          closeRouteParams: { clientId: 'client-id' },
        },
      })
    }
  )
})
