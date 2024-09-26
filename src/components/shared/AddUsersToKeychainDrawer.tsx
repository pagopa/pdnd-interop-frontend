import type { Users } from '@/api/api.generatedTypes'
import { AuthHooks } from '@/api/auth'
import { TenantQueries } from '@/api/tenant'
import { Drawer } from '@/components/shared/Drawer'
import { RHFAutocompleteMultiple } from '@/components/shared/react-hook-form-inputs'
import { Alert, Stack } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

type AddUsersFormValues = {
  selectedUsers: Users
}

type AddUsersToKeychainDrawerProps = {
  isOpen: boolean
  onClose: VoidFunction
  excludeUsersIdsList: Array<string>
  onSubmit: (relationshipIds: Users) => void
}

export const AddUsersToKeychainDrawer: React.FC<AddUsersToKeychainDrawerProps> = ({
  isOpen,
  onClose,
  excludeUsersIdsList,
  onSubmit,
}) => {
  const { t } = useTranslation('keychain', { keyPrefix: 'create.addUsersToKeychainDrawer' })
  const { t: tCommon } = useTranslation('common')

  const handleCloseDrawer = () => {
    onClose()
  }

  const { jwt } = AuthHooks.useJwt()
  const formMethods = useForm<AddUsersFormValues>({
    defaultValues: {
      selectedUsers: [],
    },
  })

  const { data: allPartyUsers = [], isPending: isLoadingAllPartyUsers } = useQuery(
    TenantQueries.getPartyUsersList({
      roles: ['admin', 'security'],
      tenantId: jwt?.organizationId as string,
    })
  )

  const availableUsers = allPartyUsers.filter(
    (partyOperator) => !excludeUsersIdsList.includes(partyOperator.userId)
  )

  const options = availableUsers.map((o) => ({
    label: `${o.name} ${o.familyName}`,
    value: o,
  }))

  const _onSubmit = ({ selectedUsers }: AddUsersFormValues) => {
    onClose()
    onSubmit(selectedUsers)
  }

  const handleTransitionExited = () => {
    formMethods.reset()
  }

  return (
    <FormProvider {...formMethods}>
      <Drawer
        isOpen={isOpen}
        onClose={handleCloseDrawer}
        title={t('title')}
        buttonAction={{
          label: tCommon('addBtn'),
          action: formMethods.handleSubmit(_onSubmit),
        }}
        onTransitionExited={handleTransitionExited}
      >
        <Stack spacing={3}>
          <RHFAutocompleteMultiple
            focusOnMount
            label={t('autocompleteInput.label')}
            labelType="external"
            size="small"
            name="selectedUsers"
            options={options}
            loading={isLoadingAllPartyUsers}
          />
          <Alert severity="info">{t('adminAlert')}</Alert>
        </Stack>
      </Drawer>
    </FormProvider>
  )
}
