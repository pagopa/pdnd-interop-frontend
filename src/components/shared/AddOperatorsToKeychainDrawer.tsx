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

type AddOperatorsFormValues = {
  selectedOperators: Users
}

type AddOperatorsDrawerProps = {
  isOpen: boolean
  onClose: VoidFunction
  excludeOperatorsIdsList: Array<string>
  onSubmit: (relationshipIds: Users) => void
}

export const AddOperatorsToKeychainDrawer: React.FC<AddOperatorsDrawerProps> = ({
  isOpen,
  onClose,
  excludeOperatorsIdsList,
  onSubmit,
}) => {
  const { t } = useTranslation('keychain', { keyPrefix: 'create.addOperatorsDrawer' })
  const { t: tCommon } = useTranslation('common')

  const handleCloseDrawer = () => {
    onClose()
  }

  const { jwt } = AuthHooks.useJwt()
  const formMethods = useForm<AddOperatorsFormValues>({
    defaultValues: {
      selectedOperators: [],
    },
  })

  const { data: allPartyOperators = [], isPending: isLoadingAllPartyOperators } = useQuery(
    TenantQueries.getPartyUsersList({
      roles: ['admin', 'security'],
      tenantId: jwt?.organizationId as string,
    })
  )

  const availableOperators = allPartyOperators.filter(
    (partyOperator) => !excludeOperatorsIdsList.includes(partyOperator.userId)
  )

  const options = availableOperators.map((o) => ({
    label: `${o.name} ${o.familyName}`,
    value: o,
  }))

  const _onSubmit = ({ selectedOperators }: AddOperatorsFormValues) => {
    onClose()
    onSubmit(selectedOperators)
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
            name="selectedOperators"
            options={options}
            loading={isLoadingAllPartyOperators}
          />
          <Alert severity="info">{t('adminAlert')}</Alert>
        </Stack>
      </Drawer>
    </FormProvider>
  )
}
