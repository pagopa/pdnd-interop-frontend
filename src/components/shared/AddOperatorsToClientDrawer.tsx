import type { RelationshipInfo } from '@/api/api.generatedTypes'
import { AuthHooks } from '@/api/auth'
import { PartyQueries } from '@/api/party'
import { Drawer } from '@/components/shared/Drawer'
import { RHFAutocompleteMultiple } from '@/components/shared/react-hook-form-inputs'
import { Alert, Stack } from '@mui/material'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

type AddSecurityOperatorFormValues = {
  selectedOperators: Array<RelationshipInfo>
}

type AddOperatorsDrawerProps = {
  isOpen: boolean
  onClose: VoidFunction
  excludeOperatorsIdsList: Array<string>
  onSubmit: (relationshipIds: Array<RelationshipInfo>) => void
}

export const AddOperatorsToClientDrawer: React.FC<AddOperatorsDrawerProps> = ({
  isOpen,
  onClose,
  excludeOperatorsIdsList,
  onSubmit,
}) => {
  const { t } = useTranslation('client', { keyPrefix: 'create.addOperatorsDrawer' })
  const { t: tCommon } = useTranslation('common')

  const handleCloseDrawer = () => {
    onClose()
  }

  const { jwt } = AuthHooks.useJwt()
  const formMethods = useForm<AddSecurityOperatorFormValues>({
    defaultValues: {
      selectedOperators: [],
    },
  })

  const { data: allPartyOperators = [], isLoading: isLoadingAllPartyOperators } =
    PartyQueries.useGetPartyUsersList(
      {
        productRoles: ['admin', 'security'],
        states: ['ACTIVE'],
        tenantId: jwt?.organizationId as string,
      },
      { suspense: false }
    )

  const availableOperators = allPartyOperators.filter(
    (partyOperator) => !excludeOperatorsIdsList.includes(partyOperator.id)
  )

  const options = availableOperators.map((o) => ({
    label: `${o.name} ${o.familyName}`,
    value: o,
  }))

  const _onSubmit = ({ selectedOperators }: AddSecurityOperatorFormValues) => {
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
