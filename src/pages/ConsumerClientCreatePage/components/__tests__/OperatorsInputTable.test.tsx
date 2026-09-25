import userEvent from '@testing-library/user-event'
import { FormProvider, useForm } from 'react-hook-form'
import type { Users } from '@/api/api.generatedTypes'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import type { CreateClientFormValues } from '../../ConsumerClientCreate.page'
import OperatorsInputTable from '../OperatorsInputTable'

const operator: Users[number] = {
  userId: 'operator-id',
  tenantId: 'tenant-id',
  name: 'Mario',
  familyName: 'Rossi',
  roles: ['security'],
}

vi.mock('@/components/shared/AddOperatorsToClientDrawer', () => ({
  AddOperatorsToClientDrawer: ({
    isOpen,
    onSubmit,
  }: {
    isOpen: boolean
    onSubmit: (operators: Users) => void
  }) =>
    isOpen ? (
      <button type="button" onClick={() => onSubmit([operator])}>
        Confirm operators
      </button>
    ) : null,
}))

const TestForm = () => {
  const formMethods = useForm<CreateClientFormValues>({
    defaultValues: { name: '', description: '', operators: [] },
  })

  return (
    <FormProvider {...formMethods}>
      <OperatorsInputTable />
      <output>{formMethods.formState.isDirty ? 'dirty' : 'pristine'}</output>
    </FormProvider>
  )
}

describe('OperatorsInputTable', () => {
  it('marks the form as dirty when operators are added programmatically', async () => {
    const screen = renderWithApplicationContext(<TestForm />, {})

    await userEvent.click(screen.getByRole('button', { name: 'addBtn' }))
    await userEvent.click(screen.getByRole('button', { name: 'Confirm operators' }))

    expect(screen.getByText('dirty')).toBeInTheDocument()
  })
})
