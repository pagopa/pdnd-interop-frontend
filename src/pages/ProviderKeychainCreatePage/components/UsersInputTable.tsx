import React from 'react'
import { Button, Stack } from '@mui/material'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { CreateKeychainFormValues } from '../ProviderKeychainCreate.page'
import { Table, TableRow } from '@pagopa/interop-fe-commons'
import PlusOneIcon from '@mui/icons-material/PlusOne'
import { useDrawerState } from '@/hooks/useDrawerState'
import type { Users } from '@/api/api.generatedTypes'
import { AddUsersToKeychainDrawer } from '@/components/shared/AddUsersToKeychainDrawer'

export const UsersInputTable: React.FC = () => {
  const { t } = useTranslation('keychain')
  const { t: tCommon } = useTranslation('common')

  const {
    isOpen: isAddUsersToKeychainDrawerOpen,
    openDrawer: openAddOUsersToKeychainDrawer,
    closeDrawer: closeAddUsersToKeychainDrawer,
  } = useDrawerState()

  const { watch, setValue } = useFormContext<CreateKeychainFormValues>()
  const users = watch('users')

  const headLabels = [tCommon('table.headData.userName'), '']

  const handleRemoveUser = (operatorId: string) => {
    const newUsers = users.filter((o) => o.userId !== operatorId)
    setValue('users', newUsers)
  }

  const handleAddUsers = (newUsers: Users) => {
    setValue('users', [...users, ...newUsers])
  }

  const handleOpenAddUsersDrawer = () => {
    openAddOUsersToKeychainDrawer()
  }

  return (
    <>
      <Table
        isEmpty={users.length === 0}
        headLabels={headLabels}
        noDataLabel={t('create.usersTable.noDataLabel')}
      >
        {users.map((user) => (
          <TableRow key={user.userId} cellData={[`${user.name} ${user.familyName}`]}>
            <Button
              onClick={handleRemoveUser.bind(null, user.userId)}
              variant="naked"
              color="error"
            >
              {tCommon('actions.delete')}
            </Button>
          </TableRow>
        ))}
      </Table>
      <Stack direction="row" sx={{ my: 2 }}>
        <Button
          type="button"
          variant="contained"
          size="small"
          onClick={handleOpenAddUsersDrawer}
          startIcon={<PlusOneIcon />}
        >
          {tCommon('addBtn')}
        </Button>
      </Stack>
      <AddUsersToKeychainDrawer
        isOpen={isAddUsersToKeychainDrawerOpen}
        onClose={closeAddUsersToKeychainDrawer}
        excludeUsersIdsList={users.map(({ userId }) => userId)}
        onSubmit={handleAddUsers}
      />
    </>
  )
}
