import React from 'react'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MISnackbar } from '@pagopa/mui-italia'
import type { MISnackbarProps } from '@pagopa/mui-italia/components/MISnackbar'
import { useTranslation } from 'react-i18next'
import { useToastNotificationStore } from '@/stores/toast-notification.store'
import { ToastNotification } from '../ToastNotification'

const { translate } = vi.hoisted(() => ({
  translate: vi.fn((key: string) => `translated:${key}`),
}))

vi.unmock('zustand')

vi.mock('@/stores', async () => import('@/stores/toast-notification.store'))

vi.mock('react-i18next', () => ({
  useTranslation: vi.fn(() => ({ t: translate })),
}))

vi.mock('@pagopa/mui-italia', () => ({
  MISnackbar: vi.fn((props: MISnackbarProps) =>
    props.open ? (
      <div role="status">
        {props.title && <h2>{props.title}</h2>}
        <p>{props.description}</p>
        {props.errorCode && <span>{props.errorCode}</span>}
        <button type="button" onClick={props.onClose}>
          Close notification
        </button>
      </div>
    ) : null
  ),
}))

const initialState = useToastNotificationStore.getState()

const resetStore = () => {
  act(() => useToastNotificationStore.setState(initialState, true))
}

const expectSnackbarProps = (expected: Record<string, unknown>) => {
  expect(vi.mocked(MISnackbar).mock.lastCall?.[0]).toStrictEqual({
    open: true,
    anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
    onClose: useToastNotificationStore.getState().hideToast,
    ...expected,
  })
}

describe('ToastNotification', () => {
  beforeEach(() => {
    resetStore()
    vi.clearAllMocks()
  })

  afterEach(resetStore)

  it.each(['success', 'info', 'warning', 'error'] as const)(
    'renders an open %s notification without error-only props',
    (severity) => {
      useToastNotificationStore.getState().showToast('Notification message', severity)

      render(<ToastNotification />)

      expect(screen.getByRole('status')).toHaveTextContent('Notification message')
      expectSnackbarProps({ severity, description: 'Notification message' })
      expect(useTranslation).toHaveBeenCalledWith('error')
      expect(translate).not.toHaveBeenCalled()
    }
  )

  it('defaults an undefined severity to success', () => {
    useToastNotificationStore.getState().showToast('Default notification', undefined)

    render(<ToastNotification />)

    expectSnackbarProps({ severity: 'success', description: 'Default notification' })
    expect(screen.getByRole('status')).toHaveTextContent('Default notification')
  })

  it('renders an error with its title, translated description and correlation ID', () => {
    useToastNotificationStore.getState().showToast('Request failed', 'error', 'correlation-123')

    render(<ToastNotification />)

    expectSnackbarProps({
      severity: 'error',
      title: 'Request failed',
      description: 'translated:axiosError.correlationIdText',
      errorCode: 'correlation-123',
      errorCodeAriaLabel: 'Identificativo',
    })
    expect(useTranslation).toHaveBeenCalledWith('error')
    expect(translate).toHaveBeenCalledWith('axiosError.correlationIdText')
    expect(screen.getByRole('heading', { name: 'Request failed' })).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('translated:axiosError.correlationIdText')
    expect(screen.getByRole('status')).toHaveTextContent('correlation-123')
  })

  it.each([undefined, ''])('omits error-only props for correlation ID %s', (correlationId) => {
    useToastNotificationStore.getState().showToast('Request failed', 'error', correlationId)

    render(<ToastNotification />)

    expectSnackbarProps({ severity: 'error', description: 'Request failed' })
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
    expect(translate).not.toHaveBeenCalled()
  })

  it.each(['success', 'info', 'warning'] as const)(
    'ignores a correlation ID for %s notifications',
    (severity) => {
      useToastNotificationStore.getState().showToast('Notification message', severity, 'ignored-id')

      render(<ToastNotification />)

      expectSnackbarProps({ severity, description: 'Notification message' })
      expect(screen.queryByText('ignored-id')).not.toBeInTheDocument()
      expect(translate).not.toHaveBeenCalled()
    }
  )

  it('starts closed and subscribes to the real store when a notification opens', () => {
    render(<ToastNotification />)

    expectSnackbarProps({ open: false, severity: 'success', description: '' })
    expect(screen.queryByRole('status')).not.toBeInTheDocument()

    act(() => useToastNotificationStore.getState().showToast('Now open', 'info'))

    expectSnackbarProps({ severity: 'info', description: 'Now open' })
    expect(screen.getByRole('status')).toHaveTextContent('Now open')
  })

  it('hides the notification through the real onClose store action', async () => {
    const user = userEvent.setup()
    useToastNotificationStore.getState().showToast('Close me', 'success')
    render(<ToastNotification />)

    expectSnackbarProps({ severity: 'success', description: 'Close me' })

    await user.click(screen.getByRole('button', { name: 'Close notification' }))

    expect(useToastNotificationStore.getState().isShown).toBe(false)
    expectSnackbarProps({ open: false, severity: 'success', description: 'Close me' })
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('updates subscribed props and removes stale error props when switching to success', () => {
    useToastNotificationStore.getState().showToast('First error', 'error', 'first-id')
    render(<ToastNotification />)

    expectSnackbarProps({
      severity: 'error',
      title: 'First error',
      description: 'translated:axiosError.correlationIdText',
      errorCode: 'first-id',
      errorCodeAriaLabel: 'Identificativo',
    })

    act(() =>
      useToastNotificationStore.getState().showToast('Updated error', 'error', 'updated-id')
    )

    expectSnackbarProps({
      severity: 'error',
      title: 'Updated error',
      description: 'translated:axiosError.correlationIdText',
      errorCode: 'updated-id',
      errorCodeAriaLabel: 'Identificativo',
    })
    expect(screen.getByRole('heading', { name: 'Updated error' })).toBeInTheDocument()

    act(() => useToastNotificationStore.getState().showToast('Recovered', 'success'))

    expectSnackbarProps({ severity: 'success', description: 'Recovered' })
    expect(screen.getByRole('status')).toHaveTextContent('Recovered')
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
    expect(screen.queryByText('updated-id')).not.toBeInTheDocument()
  })
})
