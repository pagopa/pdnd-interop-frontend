import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import { mockUseJwt, queryClientMock, setupQueryServer } from '@/utils/testing.utils'
import { render } from '@testing-library/react'
import { createMockSelfCareUser } from '__mocks__/data/user.mocks'
import OperatorsInputTable from '../OperatorsInputTable'
import React from 'react'
import type { CreateClientFormValues } from '../../ConsumerClientCreate.page'
import { FormProvider, useForm } from 'react-hook-form'
import type { RelationshipInfo } from '@/api/api.generatedTypes'
import userEvent from '@testing-library/user-event'
import { Dialog } from '@/components/dialogs'
import { QueryClientProvider } from '@tanstack/react-query'

const queryServer = setupQueryServer([
  {
    url: `${BACKEND_FOR_FRONTEND_URL}/tenants/:tenantId/relationships`,
    result: [
      createMockSelfCareUser({ id: '1', name: 'operator 1' }),
      createMockSelfCareUser({ id: '2', name: 'operator 2' }),
    ],
  },
])

beforeAll(() => queryServer.listen())
afterEach(() => queryServer.resetHandlers())
afterAll(() => queryServer.close())

const renderOperatorsInputTable = (operators: Array<RelationshipInfo> = []) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    const useFormMethods = useForm<CreateClientFormValues>({
      defaultValues: { name: '', description: '', operators },
    })

    return (
      <QueryClientProvider client={queryClientMock}>
        <Dialog />
        <FormProvider {...useFormMethods}>{children}</FormProvider>
      </QueryClientProvider>
    )
  }

  return render(<OperatorsInputTable />, { wrapper: Wrapper })
}

describe('OperatorsInputTable', () => {
  it('should match the snapshot with no selected operators', async () => {
    const screen = renderOperatorsInputTable()
    expect(screen.baseElement).toMatchSnapshot()
  })

  it('should match the snapshot with selected operators', async () => {
    const screen = renderOperatorsInputTable([createMockSelfCareUser()])
    expect(screen.baseElement).toMatchSnapshot()
  })

  it('should correctly remove operators', async () => {
    const screen = renderOperatorsInputTable([createMockSelfCareUser()])
    const user = userEvent.setup()
    const removeButton = screen.getByRole('button', { name: 'actions.delete' })

    const operatorCell = screen.getByRole('cell', { name: 'Mario Rossi' })
    expect(operatorCell).toBeInTheDocument()
    await user.click(removeButton)
    expect(operatorCell).not.toBeInTheDocument()
  })

  it('should correctly add operators', async () => {
    mockUseJwt()
    const screen = renderOperatorsInputTable()
    const user = userEvent.setup()
    const addButton = screen.getByRole('button', { name: 'addBtn' })

    await user.click(addButton)
    const operatorAutocomplete = screen.getByLabelText('content.autocompleteLabel')
    await user.click(operatorAutocomplete)
    const option = screen.getByRole('option', { name: 'operator 1 Rossi' })
    await user.click(option)

    const confirmButton = screen.getByRole('button', { name: 'actions.confirmLabel' })
    await user.click(confirmButton)

    expect(screen.getByRole('cell', { name: 'operator 1 Rossi' })).toBeInTheDocument()
  })
})
