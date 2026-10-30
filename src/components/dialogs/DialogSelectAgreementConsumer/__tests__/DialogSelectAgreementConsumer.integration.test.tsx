import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AgreementServices } from '@/api/agreement/agreement.services'
import { DelegationServices } from '@/api/delegation'
import { TenantServices } from '@/api/tenant'
import { queryClient } from '@/config/query-client'
import useGetEServiceConsumerActions from '@/hooks/useGetEServiceConsumerActions'
import { useDialogStore } from '@/stores'
import { mockUseJwt, renderHookWithApplicationContext } from '@/utils/testing.utils'
import { createMockEServiceDescriptorCatalog } from '@/../__mocks__/data/eservice.mocks'
import { createMockAgreement } from '@/../__mocks__/data/agreement.mocks'

vi.unmock('zustand')

const consumer = { id: 'chosen-consumer', name: 'Chosen consumer' }
beforeEach(() => {
  vi.spyOn(DelegationServices, 'getList').mockImplementation(async (params) => ({
    results: params.delegatorIds?.includes(consumer.id)
      ? [
          {
            id: 'chosen-delegation',
            delegate: { id: 'organizationId', name: 'orgName' },
            delegator: consumer,
            kind: 'DELEGATED_CONSUMER',
            state: 'ACTIVE',
          },
        ]
      : [],
    pagination: { totalCount: 0, offset: 0, limit: 50 },
  }))
  vi.spyOn(DelegationServices, 'getConsumerDelegators').mockResolvedValue({
    results: [consumer],
    pagination: { totalCount: 1, offset: 0, limit: 50 },
  })
  vi.spyOn(TenantServices, 'verifyTenantCertifiedAttributes').mockResolvedValue({
    hasCertifiedAttributes: true,
  })
})

afterEach(() => {
  act(() => useDialogStore.getState().closeDialog())
  queryClient.clear()
  vi.restoreAllMocks()
})

function deferred<Value>() {
  let resolve!: (value: Value) => void
  let reject!: (reason: Error) => void
  const promise = new Promise<Value>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise
    reject = rejectPromise
  })
  return { promise, resolve, reject }
}

async function openSelector(isOwnEService: boolean) {
  mockUseJwt()
  const descriptor = createMockEServiceDescriptorCatalog({
    eservice: {
      hasCertifiedAttributes: true,
      producer: { id: isOwnEService ? consumer.id : 'other-producer' },
    },
  })
  const rendered = renderHookWithApplicationContext(
    () => useGetEServiceConsumerActions(descriptor, [consumer], false),
    { withReactQueryContext: true, withRouterContext: true }
  )
  const actions = [
    rendered.result.current.primaryAction,
    rendered.result.current.secondaryAction,
    ...rendered.result.current.menuActions,
  ]
  const subscribeAction = actions.find(
    (action) => action?.label === 'tableEServiceCatalog.subscribe'
  )
  expect(subscribeAction).toBeDefined()
  act(() => subscribeAction!.action())

  const user = userEvent.setup()
  const field = await screen.findByRole('combobox', { name: 'consumerField.label' })
  await waitFor(() => expect(field).toHaveValue('orgName'))
  await user.click(screen.getByTitle('Clear'))
  await user.click(field)
  await user.click(await screen.findByRole('option', { name: consumer.name }))
  await waitFor(() => expect(field).toHaveValue(consumer.name))
  await waitFor(() =>
    expect(
      queryClient
        .getQueryCache()
        .getAll()
        .some((query) => {
          const data = query.state.data as { results?: Array<{ id: string }> } | undefined
          return data?.results?.[0]?.id === 'chosen-delegation'
        })
    ).toBe(true)
  )
  return { ...rendered, user, descriptor }
}

async function requestConfirmation(user: ReturnType<typeof userEvent.setup>) {
  const create = screen.getByRole('button', { name: 'actions.create' })
  await waitFor(() => expect(create).toBeEnabled())
  await user.click(create)
  const confirmation = await screen.findByRole('dialog', { name: 'confirmDialog.title' })
  expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
  return confirmation
}

async function confirm(user: ReturnType<typeof userEvent.setup>, isOwnEService: boolean) {
  const confirmation = await requestConfirmation(user)
  await user.click(
    within(confirmation).getByRole('button', {
      name: isOwnEService ? 'confirm' : 'confirmDialog.proceedLabel',
    })
  )
  expect(useDialogStore.getState().dialog).toBeNull()
}

describe.each([
  { method: 'createDraft' as const, isOwnEService: false },
  { method: 'submitToOwnEService' as const, isOwnEService: true },
])('consumer selector with real $method confirmation', ({ method, isOwnEService }) => {
  it('restores a non-default consumer after deferred failure and retries successfully', async () => {
    const request = deferred<ReturnType<typeof createMockAgreement>>()
    const service = vi
      .spyOn(AgreementServices, method)
      .mockImplementationOnce(() => request.promise)
      .mockResolvedValue(createMockAgreement({ id: 'created-agreement' }))
    const { user, history, descriptor } = await openSelector(isOwnEService)

    await confirm(user, isOwnEService)
    await waitFor(() => expect(service).toHaveBeenCalledOnce())
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    vi.mocked(DelegationServices.getConsumerDelegators).mockResolvedValue({
      results: [],
      pagination: { totalCount: 0, offset: 0, limit: 50 },
    })
    await act(async () => {
      await queryClient.refetchQueries({
        queryKey: ['DelegationGetConsumerDelegators'],
        type: 'all',
      })
    })
    await act(async () => request.reject(new Error('backend failure')))

    const restored = await screen.findByRole('combobox', { name: 'consumerField.label' })
    await waitFor(() => expect(restored).toHaveValue(consumer.name))
    expect(useDialogStore.getState().dialog).toMatchObject({
      type: 'selectAgreementConsumer',
      initialSelectedConsumer: consumer,
    })
    expect(history.location.pathname).toBe('/')

    await confirm(user, isOwnEService)
    await waitFor(() => expect(service).toHaveBeenCalledTimes(2))
    expect(service).toHaveBeenLastCalledWith({
      eserviceId: descriptor.eservice.id,
      descriptorId: descriptor.id,
      delegationId: 'chosen-delegation',
    })
    await waitFor(() =>
      expect(history.location.pathname).toBe(
        `/it/fruizione/richieste/created-agreement${isOwnEService ? '' : '/modifica'}`
      )
    )
    expect(useDialogStore.getState().dialog).toBeNull()
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
  })

  it('does not restore the selector when confirmation is cancelled', async () => {
    const service = vi.spyOn(AgreementServices, method)
    const { user, history } = await openSelector(isOwnEService)
    const confirmation = await requestConfirmation(user)
    await user.click(within(confirmation).getByRole('button', { name: 'cancel' }))

    await waitFor(() =>
      expect(queryClient.getMutationCache().getAll()[0]?.state.status).toBe('error')
    )
    expect(service).not.toHaveBeenCalled()
    expect(useDialogStore.getState().dialog).toBeNull()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(history.location.pathname).toBe('/')
  })

  it.each(['failure', 'success'])('preserves a newer dialog on deferred %s', async (outcome) => {
    const request = deferred<ReturnType<typeof createMockAgreement>>()
    const service = vi.spyOn(AgreementServices, method).mockImplementation(() => request.promise)
    const { user } = await openSelector(isOwnEService)
    await confirm(user, isOwnEService)
    await waitFor(() => expect(service).toHaveBeenCalledOnce())

    const newerDialog = { type: 'basic' as const, title: 'New dialog', onProceed: vi.fn() }
    act(() => useDialogStore.getState().openDialog(newerDialog))
    await act(async () => {
      if (outcome === 'failure') request.reject(new Error('backend failure'))
      else request.resolve(createMockAgreement({ id: 'created-agreement' }))
    })
    await waitFor(() =>
      expect(queryClient.getMutationCache().getAll()[0]?.state.status).toBe(
        outcome === 'failure' ? 'error' : 'success'
      )
    )
    expect(useDialogStore.getState().dialog).toBe(newerDialog)
    expect(screen.getByRole('dialog', { name: 'New dialog' })).toBeInTheDocument()
  })
})

it('allows manual cancellation of the selector without starting a mutation', async () => {
  const service = vi.spyOn(AgreementServices, 'createDraft')
  const { user } = await openSelector(false)
  await user.click(screen.getByRole('button', { name: 'cancel' }))
  expect(useDialogStore.getState().dialog).toBeNull()
  expect(service).not.toHaveBeenCalled()
  expect(queryClient.getMutationCache().getAll()).toHaveLength(0)
})
