import React from 'react'
import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ErrorBoundary } from 'react-error-boundary'
import { ClientServices } from '@/api/client'
import type { Client, ClientPurpose } from '@/api/api.generatedTypes'
import { queryClient } from '@/config/query-client'
import { useToastNotificationStore } from '@/stores'
import {
  mockUseJwt,
  ReactHookFormWrapper,
  renderWithApplicationContext,
} from '@/utils/testing.utils'
import { createMockClient } from '../../../../../../../__mocks__/data/client.mocks'
import { createMockPublicKey } from '../../../../../../../__mocks__/data/key.mocks'
import { VoucherConsumerSimulationSection } from '../VoucherConsumerSimulationSection'

vi.mock('@/hooks/useClientKind', () => ({
  useClientKind: () => 'CONSUMER',
}))

vi.mock('@/router', () => ({
  useNavigate: () => vi.fn(),
}))

const clientId = 'client-1'
const clientKeys = [createMockPublicKey()]
const purposes: ClientPurpose[] = Array.from({ length: 55 }, (_, index) => ({
  purposeId: `purpose-${index}`,
  title: `Purpose ${index}`,
  eservice: {
    id: `eservice-${index}`,
    name: `Eservice ${index}`,
    producer: { id: 'producer-1', name: 'Producer' },
  },
}))
const client = createMockClient({ id: clientId, purposes })
const defaultOptions = queryClient.getDefaultOptions()

function renderSection(selectedClientId: string | null = clientId) {
  return renderWithApplicationContext(
    <ErrorBoundary fallback={<div>queryErrorFallback</div>}>
      <ReactHookFormWrapper
        defaultValues={{
          clientId: selectedClientId,
          purposeId: null,
          keyId: null,
          interactionType: 'SYNC',
        }}
      >
        <VoucherConsumerSimulationSection />
      </ReactHookFormWrapper>
    </ErrorBoundary>,
    { withReactQueryContext: true }
  )
}

function getPurposeSelect() {
  return screen.getByRole('combobox', { name: /generalForm.purposeSelectInput.label/ })
}

describe('VoucherConsumerSimulationSection', () => {
  beforeEach(() => {
    queryClient.clear()
    queryClient.setDefaultOptions({ queries: { retry: false, throwOnError: true } })
    mockUseJwt()
    vi.spyOn(ClientServices, 'getList').mockResolvedValue({
      results: [{ id: client.id, name: client.name, hasKeys: true }],
      pagination: { offset: 0, limit: 50, totalCount: 1 },
    })
    vi.spyOn(ClientServices, 'getAllKeysList').mockResolvedValue(clientKeys)
  })

  afterEach(() => {
    queryClient.clear()
    queryClient.setDefaultOptions(defaultOptions)
    vi.restoreAllMocks()
  })

  it('keeps purposes disabled without loading or empty feedback before selecting a client', async () => {
    const getClient = vi.spyOn(ClientServices, 'getSingle')
    renderSection(null)

    await screen.findByRole('combobox', { name: /generalForm.clientSelectInput.label/ })

    expect(getPurposeSelect()).toHaveAttribute('aria-disabled', 'true')
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(getClient).not.toHaveBeenCalled()
  })

  it('indicates loading without empty feedback, then enables every returned purpose', async () => {
    const user = userEvent.setup()
    let resolveClient: (value: Client) => void = () => {}
    vi.spyOn(ClientServices, 'getSingle').mockReturnValue(
      new Promise<Client>((resolve) => {
        resolveClient = resolve
      })
    )
    renderSection()

    expect(
      await screen.findByRole('progressbar', { name: 'generalForm.purposeSelectInput.loading' })
    ).toBeInTheDocument()
    expect(getPurposeSelect()).toHaveAttribute('aria-disabled', 'true')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()

    await act(async () => resolveClient(client))
    await waitFor(() => expect(getPurposeSelect()).not.toHaveAttribute('aria-disabled', 'true'))

    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
    expect(getPurposeSelect()).not.toHaveTextContent(/Purpose \d/)
    await user.click(getPurposeSelect())
    const options = within(screen.getByRole('listbox')).getAllByRole('option')
    expect(options).toHaveLength(purposes.length)
    purposes.forEach((purpose, index) => {
      expect(options[index]).toHaveTextContent(`${purpose.title} per ${purpose.eservice.name}`)
    })
    await user.click(options[54])
    expect(getPurposeSelect()).toHaveTextContent('Purpose 54 per Eservice 54')
  })

  it('automatically selects the only purpose after loading completes', async () => {
    let resolveClient: (value: Client) => void = () => {}
    const singlePurposeClient = createMockClient({ id: clientId, purposes: [purposes[0]] })
    queryClient.setQueryData(['ClientGetSingle', clientId], singlePurposeClient)
    vi.spyOn(ClientServices, 'getSingle').mockReturnValue(
      new Promise<Client>((resolve) => {
        resolveClient = resolve
      })
    )
    renderSection()

    expect(
      await screen.findByRole('progressbar', { name: 'generalForm.purposeSelectInput.loading' })
    ).toBeInTheDocument()
    expect(getPurposeSelect()).not.toHaveTextContent('Purpose 0 per Eservice 0')

    await act(async () => resolveClient(singlePurposeClient))

    await waitFor(() => expect(getPurposeSelect()).toHaveTextContent('Purpose 0 per Eservice 0'))
    expect(getPurposeSelect()).not.toHaveAttribute('aria-disabled', 'true')
  })

  it('shows the empty state only after a successful response with no purposes', async () => {
    vi.spyOn(ClientServices, 'getSingle').mockResolvedValue(createMockClient({ purposes: [] }))
    renderSection()

    expect(await screen.findByText('noPurposesLabelAdmin.title')).toBeInTheDocument()
    expect(getPurposeSelect()).toHaveAttribute('aria-disabled', 'true')
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
  })

  it('shows an error snackbar only after exhausting automatic retries', async () => {
    queryClient.setDefaultOptions({ queries: { ...defaultOptions.queries, retryDelay: 0 } })
    const showToast = vi.spyOn(useToastNotificationStore.getState(), 'showToast')
    let rejectRetry: (reason: Error) => void = () => {}
    const getClient = vi
      .spyOn(ClientServices, 'getSingle')
      .mockRejectedValueOnce(new Error('Unable to load client'))
      .mockReturnValueOnce(
        new Promise<Client>((_, reject) => {
          rejectRetry = reject
        })
      )
      .mockRejectedValue(new Error('Unable to load client'))
    renderSection()

    await waitFor(() => expect(getClient).toHaveBeenCalledTimes(2))
    expect(
      screen.getByRole('progressbar', { name: 'generalForm.purposeSelectInput.loading' })
    ).toBeInTheDocument()
    expect(getPurposeSelect()).toHaveAttribute('aria-disabled', 'true')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(showToast).not.toHaveBeenCalled()

    await act(async () => rejectRetry(new Error('Unable to load client')))

    expect(await screen.findByText('generalForm.purposeSelectInput.error')).toBeInTheDocument()
    expect(showToast).toHaveBeenCalledExactlyOnceWith(
      'generalForm.purposeSelectInput.error',
      'error'
    )
    expect(getClient).toHaveBeenCalledTimes(4)
    expect(screen.queryByText('queryErrorFallback')).not.toBeInTheDocument()
    expect(screen.queryByText('noPurposesLabelAdmin.title')).not.toBeInTheDocument()
    expect(screen.queryByText('noPurposesAndKeysLabel.title')).not.toBeInTheDocument()
    expect(getPurposeSelect()).toHaveAttribute('aria-disabled', 'true')
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'generalForm.purposeSelectInput.retry' })
    ).not.toBeInTheDocument()
  })

  it('does not show an error snackbar when an automatic retry succeeds', async () => {
    queryClient.setDefaultOptions({ queries: { ...defaultOptions.queries, retryDelay: 0 } })
    const showToast = vi.spyOn(useToastNotificationStore.getState(), 'showToast')
    const getClient = vi
      .spyOn(ClientServices, 'getSingle')
      .mockRejectedValueOnce(new Error('Unable to load client'))
      .mockResolvedValueOnce(client)
    renderSection()

    await waitFor(() => expect(getPurposeSelect()).not.toHaveAttribute('aria-disabled', 'true'))
    expect(getClient).toHaveBeenCalledTimes(2)
    expect(getClient).toHaveBeenLastCalledWith(clientId)
    expect(showToast).not.toHaveBeenCalled()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('keeps cached purposes disabled after a failed refresh', async () => {
    queryClient.setQueryData(
      ['ClientGetSingle', clientId],
      createMockClient({ id: clientId, purposes: [purposes[0]] })
    )
    vi.spyOn(ClientServices, 'getSingle').mockRejectedValue(new Error('Unable to refresh client'))
    renderSection()

    expect(await screen.findByText('generalForm.purposeSelectInput.error')).toBeInTheDocument()
    expect(getPurposeSelect()).toHaveAttribute('aria-disabled', 'true')
    expect(getPurposeSelect()).not.toHaveTextContent('Purpose 0 per Eservice 0')
    expect(screen.queryByText('noPurposesLabelAdmin.title')).not.toBeInTheDocument()
  })
})
