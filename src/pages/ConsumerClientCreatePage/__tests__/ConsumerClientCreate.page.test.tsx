import React from 'react'
import {
  mockUseClientKind,
  renderWithApplicationContext,
  setupQueryServer,
} from '@/utils/testing.utils'
import ConsumerClientCreatePage from '../ConsumerClientCreate.page'
import userEvent from '@testing-library/user-event'
import { ClientMutations } from '@/api/client'
import { vi } from 'vitest'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import { createMockSelfCareUser } from '__mocks__/data/user.mocks'

const mockPromise = () => new Promise((resolve) => resolve({ id: '123' }))

const createClientFn = vi.fn().mockImplementation(mockPromise)
vi.spyOn(ClientMutations, 'useCreate').mockReturnValue({
  mutateAsync: createClientFn,
} as unknown as ReturnType<typeof ClientMutations.useCreate>)

const createM2MClientFn = vi.fn().mockImplementation(mockPromise)
vi.spyOn(ClientMutations, 'useCreateInteropM2M').mockReturnValue({
  mutateAsync: createM2MClientFn,
} as unknown as ReturnType<typeof ClientMutations.useCreateInteropM2M>)

const addOperatorFn = vi.fn().mockImplementation(mockPromise)
vi.spyOn(ClientMutations, 'useAddOperator').mockReturnValue({
  mutateAsync: addOperatorFn,
} as unknown as ReturnType<typeof ClientMutations.useAddOperator>)

afterEach(() => {
  createClientFn.mockClear()
  createM2MClientFn.mockClear()
  addOperatorFn.mockClear()
})

const queryServer = setupQueryServer([
  {
    url: `${BACKEND_FOR_FRONTEND_URL}/tenants/:tenantId/relationships`,
    result: [
      createMockSelfCareUser({ id: '1', name: 'operator 1' }),
      createMockSelfCareUser({ id: '2', name: 'operator 2' }),
    ],
  },
])

describe('ConsumerClientCreatePage', () => {
  it('should match snapshot', () => {
    mockUseClientKind('API')
    const { baseElement } = renderWithApplicationContext(<ConsumerClientCreatePage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(baseElement).toMatchSnapshot()
  })

  it('should correctly validate the form', async () => {
    mockUseClientKind('API')
    const screen = renderWithApplicationContext(<ConsumerClientCreatePage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    const user = userEvent.setup()

    const nameInput = screen.getByLabelText('create.nameField.label')
    const descriptionInput = screen.getByLabelText('create.descriptionField.label')
    const submitButton = screen.getByRole('button', { name: 'create.actions.createLabel' })

    await user.click(submitButton)

    const requiredError = screen.getAllByText('validation.mixed.required')
    expect(requiredError).toHaveLength(2)

    await user.type(nameInput, 'a')
    await user.type(descriptionInput, 'a')

    const minLengthError = screen.getAllByText('validation.string.minLength')
    expect(minLengthError).toHaveLength(2)
  })

  it('should correctly submit the form (API)', async () => {
    mockUseClientKind('API')
    queryServer.listen()
    const screen = renderWithApplicationContext(<ConsumerClientCreatePage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    const user = userEvent.setup()

    const nameInput = screen.getByLabelText('create.nameField.label')
    const descriptionInput = screen.getByLabelText('create.descriptionField.label')
    const submitButton = screen.getByRole('button', { name: 'create.actions.createLabel' })

    await user.type(nameInput, 'client name')
    await user.type(descriptionInput, 'client description')

    const addOperatorButton = screen.getByRole('button', { name: 'addBtn' })

    await user.click(addOperatorButton)
    const operatorAutocomplete = screen.getByLabelText('content.autocompleteLabel')
    await user.click(operatorAutocomplete)
    const operatorOption = screen.getByRole('option', { name: 'operator 1 Rossi' })
    await user.click(operatorOption)

    const confirmAddOperatorButton = screen.getByRole('button', { name: 'actions.confirmLabel' })
    await user.click(confirmAddOperatorButton)

    await user.click(submitButton)

    expect(createClientFn).not.toHaveBeenCalled()
    expect(createM2MClientFn).toHaveBeenCalledWith({
      name: 'client name',
      description: 'client description',
    })

    expect(screen.history.location.pathname).toBe('/it/fruizione/interop-m2m/123')

    queryServer.close()
  })

  it('should correctly submit the form (CONSUMER)', async () => {
    mockUseClientKind('CONSUMER')
    queryServer.listen()
    const screen = renderWithApplicationContext(<ConsumerClientCreatePage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    const user = userEvent.setup()

    const nameInput = screen.getByLabelText('create.nameField.label')
    const descriptionInput = screen.getByLabelText('create.descriptionField.label')
    const submitButton = screen.getByRole('button', { name: 'create.actions.createLabel' })

    await user.type(nameInput, 'client M2M name')
    await user.type(descriptionInput, 'client M2M description')

    const addOperatorButton = screen.getByRole('button', { name: 'addBtn' })

    await user.click(addOperatorButton)
    const operatorAutocomplete = screen.getByLabelText('content.autocompleteLabel')
    await user.click(operatorAutocomplete)
    const operatorOption = screen.getByRole('option', { name: 'operator 1 Rossi' })
    await user.click(operatorOption)

    const confirmAddOperatorButton = screen.getByRole('button', { name: 'actions.confirmLabel' })
    await user.click(confirmAddOperatorButton)

    await user.click(submitButton)

    expect(createClientFn).toHaveBeenCalledWith({
      name: 'client M2M name',
      description: 'client M2M description',
    })
    expect(createM2MClientFn).not.toHaveBeenCalled()

    expect(screen.history.location.pathname).toBe('/it/fruizione/client/123')

    queryServer.close()
  })
})
