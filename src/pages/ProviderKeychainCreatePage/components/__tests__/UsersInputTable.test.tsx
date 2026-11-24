import userEvent from '@testing-library/user-event'
import { FormProvider, useForm } from 'react-hook-form'
import type { Users } from '@/api/api.generatedTypes'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import type { CreateKeychainFormValues } from '../../ProviderKeychainCreate.page'
import { UsersInputTable } from '../UsersInputTable'

const user: Users[number] = {
  userId: 'user-id',
  tenantId: 'tenant-id',
  name: 'Mario',
  familyName: 'Rossi',
  roles: ['security'],
}

vi.mock('@/components/shared/AddUsersToKeychainDrawer', () => ({
  AddUsersToKeychainDrawer: ({
    isOpen,
    onSubmit,
  }: {
    isOpen: boolean
    onSubmit: (users: Users) => void
  }) =>
    isOpen ? (
      <button type="button" onClick={() => onSubmit([user])}>
        Confirm users
      </button>
    ) : null,
}))

const TestForm = () => {
  const formMethods = useForm<CreateKeychainFormValues>({
    defaultValues: { name: '', description: '', users: [] },
  })

  return (
    <FormProvider {...formMethods}>
      <UsersInputTable />
      <output>{formMethods.formState.isDirty ? 'dirty' : 'pristine'}</output>
    </FormProvider>
  )
}

describe('UsersInputTable', () => {
  it('marks the form as dirty when users are added programmatically', async () => {
    const screen = renderWithApplicationContext(<TestForm />, {})

    await userEvent.click(screen.getByRole('button', { name: 'addBtn' }))
    await userEvent.click(screen.getByRole('button', { name: 'Confirm users' }))

    expect(screen.getByText('dirty')).toBeInTheDocument()
  })
})
