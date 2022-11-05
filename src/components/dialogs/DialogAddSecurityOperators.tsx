import React from 'react'
import { ClientMutations, ClientQueries } from '@/api/client'
import { PartyQueries } from '@/api/party/party.hooks'
import { useDialog } from '@/contexts'
import { useJwt } from '@/hooks/useJwt'
import { DialogAddSecurityOperatorsProps } from '@/types/dialog.types'
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material'
import identity from 'lodash/identity'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { AutocompleteMultiple } from '../shared/ReactHookFormInputs'

type AddSecurityOperatorFormValues = {
  selectedOperators: Array<string>
}

export const DialogAddSecurityOperators: React.FC<DialogAddSecurityOperatorsProps> = ({
  clientId,
}) => {
  const { t } = useTranslation('shared-components', {
    keyPrefix: 'dialogAddSecurityOperators',
    useSuspense: false,
  })
  const { closeDialog } = useDialog()
  const { mutateAsync: addOperator } = ClientMutations.useAddOperator()

  const { jwt } = useJwt()
  const formMethods = useForm<AddSecurityOperatorFormValues>({
    defaultValues: {
      selectedOperators: [],
    },
  })

  const { data: currentOperators = [], isLoading: isLoadingCurrentOperators } =
    ClientQueries.useGetOperatorsList(clientId, undefined, { suspense: false })

  const { data: allPartyOperators = [], isLoading: isLoadingAllPartyOperators } =
    PartyQueries.useGetUsersList(
      jwt?.organizationId,
      {
        productRoles: ['admin', 'security'],
        states: ['ACTIVE'],
      },
      { suspense: false }
    )

  const options = React.useMemo(() => {
    const currentOperatorsIds = currentOperators
      .map(({ relationshipId }) => relationshipId)
      .filter(identity)
    const availableOperators = allPartyOperators.filter(
      (partyOperator) => !currentOperatorsIds.includes(partyOperator.id)
    )

    return availableOperators.map((o) => ({ label: `${o.name} ${o.familyName}`, value: o.id }))
  }, [currentOperators, allPartyOperators])

  const onSubmit = ({ selectedOperators }: AddSecurityOperatorFormValues) => {
    closeDialog()
    Promise.all(
      selectedOperators.map((selectedOperator) =>
        addOperator({ clientId, relationshipId: selectedOperator })
      )
    )
  }

  return (
    <Dialog open onClose={closeDialog} fullWidth>
      <FormProvider {...formMethods}>
        <Box component="form" onSubmit={formMethods.handleSubmit(onSubmit)}>
          <DialogTitle>{t('title')}</DialogTitle>

          <DialogContent>
            <Box>
              <AutocompleteMultiple
                focusOnMount
                label={t('content.autocompleteLabel')}
                sx={{ mt: 6, mb: 0 }}
                name="selectedOperators"
                options={options}
                loading={isLoadingCurrentOperators || isLoadingAllPartyOperators}
              />
            </Box>

            <Alert sx={{ mt: 1 }} severity="info">
              {t('content.adminAlert')}
            </Alert>
          </DialogContent>

          <DialogActions>
            <Button type="button" variant="outlined" onClick={closeDialog}>
              {t('actions.cancelLabel')}
            </Button>
            <Button variant="contained" type="submit">
              {t('actions.confirmLabel')}
            </Button>
          </DialogActions>
        </Box>
      </FormProvider>
    </Dialog>
  )
}
