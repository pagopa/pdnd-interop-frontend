import { rest } from 'msw'
import { setupServer } from 'msw/node'
import userEvent from '@testing-library/user-event'
import { screen } from '@testing-library/react'
import { beforeAll, afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Agreement, AgreementPayload, CreatedResource } from '@/api/api.generatedTypes'
import type * as Stores from '@/stores'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import { queryClient } from '@/config/query-client'
import { createMockAgreement } from '@/../__mocks__/data/agreement.mocks'
import { createMockEServiceDescriptorCatalog } from '@/../__mocks__/data/eservice.mocks'
import { DialogCreateAgreement } from '../DialogCreateAgreement'
import { DialogEditAgreement } from '../DialogEditAgreement'
import { DialogInspectAgreement } from '../DialogInspectAgreement'
import { DialogUpdateAgreement } from '../DialogUpdateAgreement'
import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'

type MutationOptions<T> = {
  onSuccess: (data: T) => void
}

const {
  closeDialogMock,
  navigateMock,
  createDraftMock,
  submitToOwnEServiceMock,
  upgradeAgreementMock,
} = vi.hoisted(() => ({
  closeDialogMock: vi.fn(),
  navigateMock: vi.fn(),
  createDraftMock:
    vi.fn<
      (
        payload: { eserviceName: string; eserviceVersion: string | undefined } & AgreementPayload,
        options: MutationOptions<CreatedResource>
      ) => void
    >(),
  submitToOwnEServiceMock:
    vi.fn<(payload: AgreementPayload, options: MutationOptions<CreatedResource>) => void>(),
  upgradeAgreementMock:
    vi.fn<(payload: { agreementId: string }, options: MutationOptions<Agreement>) => void>(),
}))

vi.mock('@/router', () => ({
  useNavigate: () => navigateMock,
  useParams: () => ({ eserviceId: 'eservice-id', descriptorId: 'descriptor-id' }),
}))

vi.mock('@/stores', async () => {
  const actual = await vi.importActual<typeof Stores>('@/stores')
  return {
    ...actual,
    useDialog: () => ({ closeDialog: closeDialogMock }),
  }
})

vi.mock('@/api/agreement', () => ({
  AgreementMutations: {
    useCreateDraft: () => ({ mutate: createDraftMock }),
    useSubmitToOwnEService: () => ({ mutate: submitToOwnEServiceMock }),
    useUpgrade: () => ({ mutate: upgradeAgreementMock }),
  },
}))

const descriptor = createMockEServiceDescriptorCatalog({
  id: 'descriptor-id',
  eservice: {
    id: 'eservice-id',
    name: 'E-service name',
    producer: { id: 'producer-id', name: 'Producer' },
    activeDescriptor: {
      id: 'active-descriptor-id',
      state: 'PUBLISHED',
      version: '2',
      audience: [],
    },
  },
})

const consumers = [
  { id: 'organizationId', name: 'Consumer' },
  { id: 'producer-id', name: 'Producer' },
]

const agreements = [
  { id: 'agreement-id', consumerId: 'organizationId', descriptorId: 'descriptor-id' },
]

const server = setupServer(
  rest.get(
    `${BACKEND_FOR_FRONTEND_URL}/catalog/eservices/:eserviceId/descriptor/:descriptorId`,
    (_, res, ctx) => res(ctx.json(descriptor))
  ),
  rest.get(`${BACKEND_FOR_FRONTEND_URL}/delegations`, (_, res, ctx) =>
    res(ctx.json({ results: [] }))
  ),
  rest.get(
    `${BACKEND_FOR_FRONTEND_URL}/tenants/:tenantId/eservices/:eserviceId/descriptors/:descriptorId/certifiedAttributes/validate`,
    (_, res, ctx) => res(ctx.json({ hasCertifiedAttributes: true }))
  )
)

function renderDialog(ui: React.ReactElement) {
  return renderWithApplicationContext(ui, {
    withReactQueryContext: true,
    withRouterContext: true,
  })
}

async function selectConsumer(name = 'Consumer') {
  const user = userEvent.setup()
  await user.click(screen.getByRole('combobox'))
  await user.click(await screen.findByRole('option', { name }))
  return user
}

beforeAll(() => server.listen())

beforeEach(() => {
  mockUseJwt()
  createDraftMock.mockImplementation((_payload, options) =>
    options.onSuccess({ id: 'created-agreement-id' })
  )
  submitToOwnEServiceMock.mockImplementation((_payload, options) =>
    options.onSuccess({ id: 'submitted-agreement-id' })
  )
  upgradeAgreementMock.mockImplementation((_payload, options) =>
    options.onSuccess(createMockAgreement({ id: 'upgraded-agreement-id', state: 'DRAFT' }))
  )
})

afterEach(() => {
  server.resetHandlers()
  queryClient.clear()
  vi.clearAllMocks()
})

afterAll(() => server.close())

describe('DialogCreateAgreement', () => {
  it('creates a draft and navigates to its edit page for the selected consumer', async () => {
    renderDialog(<DialogCreateAgreement type="createAgreement" consumers={consumers} />)

    const confirmButton = screen.getByRole('button', { name: 'actions.confirm' })
    expect(confirmButton).toBeDisabled()

    const user = await selectConsumer()
    expect(confirmButton).toBeEnabled()
    await user.click(confirmButton)

    expect(createDraftMock).toHaveBeenCalledWith(
      {
        eserviceName: 'E-service name',
        eserviceId: 'eservice-id',
        eserviceVersion: '1',
        descriptorId: 'descriptor-id',
        delegationId: undefined,
      },
      expect.objectContaining({ onSuccess: expect.any(Function) })
    )
    expect(navigateMock).toHaveBeenCalledWith('SUBSCRIBE_AGREEMENT_EDIT', {
      params: { agreementId: 'created-agreement-id' },
    })
    expect(closeDialogMock).toHaveBeenCalledOnce()
  })

  it('submits directly when the consumer is the producer', async () => {
    mockUseJwt({ jwt: { organizationId: 'producer-id' } })
    renderDialog(<DialogCreateAgreement type="createAgreement" consumers={consumers} />)

    const user = await selectConsumer('Producer')
    await user.click(screen.getByRole('button', { name: 'actions.confirm' }))

    expect(submitToOwnEServiceMock).toHaveBeenCalledWith(
      {
        eserviceId: 'eservice-id',
        descriptorId: 'descriptor-id',
        delegationId: undefined,
      },
      expect.objectContaining({ onSuccess: expect.any(Function) })
    )
    expect(navigateMock).toHaveBeenCalledWith('SUBSCRIBE_AGREEMENT_READ', {
      params: { agreementId: 'submitted-agreement-id' },
    })
    expect(closeDialogMock).toHaveBeenCalledOnce()
    expect(createDraftMock).not.toHaveBeenCalled()
  })
})

describe('DialogEditAgreement', () => {
  it('opens the selected consumer agreement in edit mode and closes the dialog', async () => {
    renderDialog(
      <DialogEditAgreement type="editAgreement" consumers={consumers} agreements={agreements} />
    )

    const confirmButton = screen.getByRole('button', { name: 'actions.confirm' })
    expect(confirmButton).toBeDisabled()

    const user = await selectConsumer()
    expect(confirmButton).toBeEnabled()
    expect(screen.getByRole('combobox')).toHaveValue('Consumer')
    await user.click(confirmButton)

    expect(closeDialogMock).toHaveBeenCalledOnce()
    expect(navigateMock).toHaveBeenCalledWith('SUBSCRIBE_AGREEMENT_EDIT', {
      params: { agreementId: 'agreement-id' },
    })
  })
})

describe('DialogInspectAgreement', () => {
  it('opens the selected consumer agreement in read mode and closes the dialog', async () => {
    renderDialog(
      <DialogInspectAgreement
        type="inspectAgreement"
        consumers={consumers}
        agreements={agreements}
      />
    )

    const confirmButton = screen.getByRole('button', { name: 'actions.confirm' })
    expect(confirmButton).toBeDisabled()

    const user = await selectConsumer()
    expect(confirmButton).toBeEnabled()
    await user.click(confirmButton)

    expect(navigateMock).toHaveBeenCalledWith('SUBSCRIBE_AGREEMENT_READ', {
      params: { agreementId: 'agreement-id' },
    })
    expect(closeDialogMock).toHaveBeenCalledOnce()
  })
})

describe('DialogUpdateAgreement', () => {
  it.each([
    { state: 'DRAFT' as const, route: 'SUBSCRIBE_AGREEMENT_EDIT' },
    { state: 'ACTIVE' as const, route: 'SUBSCRIBE_AGREEMENT_READ' },
  ])('routes to $route after the upgrade returns $state', async ({ state, route }) => {
    upgradeAgreementMock.mockImplementation((_payload, options) =>
      options.onSuccess(createMockAgreement({ id: 'upgraded-agreement-id', state }))
    )
    renderDialog(
      <DialogUpdateAgreement type="updateAgreement" consumers={consumers} agreements={agreements} />
    )

    const user = await selectConsumer()
    const confirmButton = await screen.findByRole('button', { name: 'actions.confirm' })
    expect(confirmButton).toBeEnabled()
    await user.click(confirmButton)

    expect(upgradeAgreementMock).toHaveBeenCalledWith(
      { agreementId: 'agreement-id' },
      expect.objectContaining({ onSuccess: expect.any(Function) })
    )
    expect(navigateMock).toHaveBeenCalledWith(route, {
      params: { agreementId: 'upgraded-agreement-id' },
    })
    expect(closeDialogMock).toHaveBeenCalledOnce()
  })

  it('disables the upgrade when the consumer lacks required certified attributes', async () => {
    server.use(
      rest.get(
        `${BACKEND_FOR_FRONTEND_URL}/tenants/:tenantId/eservices/:eserviceId/descriptors/:descriptorId/certifiedAttributes/validate`,
        (_, res, ctx) => res(ctx.json({ hasCertifiedAttributes: false }))
      )
    )
    renderDialog(
      <DialogUpdateAgreement type="updateAgreement" consumers={consumers} agreements={agreements} />
    )

    await selectConsumer()

    expect(await screen.findByText('alerts.missingAttributes')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'actions.confirm' })).toBeDisabled()
    expect(upgradeAgreementMock).not.toHaveBeenCalled()
  })
})
