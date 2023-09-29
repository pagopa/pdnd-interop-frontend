import React from 'react'
import { Drawer } from '@/components/shared/Drawer'
import { RHFAutocompleteMultiple } from '@/components/shared/react-hook-form-inputs'
import { PartyQueries } from '@/api/party'
import { FormProvider, useForm } from 'react-hook-form'
import type { RelationshipInfo } from '@/api/api.generatedTypes'
import { AuthHooks } from '@/api/auth'
import { ClientMutations, ClientQueries } from '@/api/client'
import { Box } from '@mui/material'
import { useTranslation } from 'react-i18next'

type AddSecurityOperatorFormValues = {
  selectedOperators: Array<RelationshipInfo>
}

type AddOperatorsToClientDrawerProps = {
  isOpen: boolean
  onClose: VoidFunction
  clientId: string
}

export const AddOperatorsToClientDrawer: React.FC<AddOperatorsToClientDrawerProps> = ({
  isOpen,
  onClose,
  clientId,
}) => {
  const { jwt } = AuthHooks.useJwt()
  const { t } = useTranslation('client')
  const { t: tCommon } = useTranslation('common')
  const { mutateAsync: addOperator } = ClientMutations.useAddOperator()

  const { data: currentOperators = [] } = ClientQueries.useGetOperatorsList(clientId, {
    suspense: false,
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

  const formMethods = useForm<AddSecurityOperatorFormValues>({
    defaultValues: {
      selectedOperators: [],
    },
  })

  const handleSubmit = formMethods.handleSubmit(async (operators) => {
    await Promise.all(
      operators.selectedOperators.map(({ id }) => addOperator({ clientId, relationshipId: id }))
    )
    onClose()
  })

  const excludeOperatorsIdsList = currentOperators.map(({ relationshipId }) => relationshipId)

  const availableOperators = allPartyOperators.filter(
    (partyOperator) => !excludeOperatorsIdsList.includes(partyOperator.id)
  )

  const options = availableOperators.map((o) => ({
    label: `${o.name} ${o.familyName}`,
    value: o,
  }))

  return (
    <FormProvider {...formMethods}>
      <Box component="form" noValidate onSubmit={handleSubmit}>
        <Drawer
          title={t('create.addOperatorsDrawer.title')}
          isOpen={isOpen}
          onClose={onClose}
          onTransitionExited={formMethods.reset}
          buttonAction={{
            label: tCommon('addBtn'),
            action: handleSubmit,
          }}
        >
          <RHFAutocompleteMultiple
            focusOnMount
            size="small"
            label={t('create.addOperatorsDrawer.autocompleteInput.label')}
            labelType="external"
            sx={{ mt: 6, mb: 0 }}
            name="selectedOperators"
            options={options}
            loading={isLoadingAllPartyOperators}
          />
        </Drawer>
      </Box>
    </FormProvider>
  )
}
