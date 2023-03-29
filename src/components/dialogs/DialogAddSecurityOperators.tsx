import React from 'react'
import { PartyQueries } from '@/api/party/party.hooks'
import { useDialog } from '@/stores'
import { useJwt } from '@/hooks/useJwt'
import type { DialogAddSecurityOperatorsProps } from '@/types/dialog.types'
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { RHFAutocompleteMultiple } from '../shared/react-hook-form-inputs'
import type { RelationshipInfo } from '@/api/api.generatedTypes'

type AddSecurityOperatorFormValues = {
  selectedOperators: Array<RelationshipInfo>
}

export const DialogAddSecurityOperators: React.FC<DialogAddSecurityOperatorsProps> = ({
  excludeOperatorsIdsList,
  onSubmit,
}) => {
  const ariaLabelId = React.useId()
  const { t } = useTranslation('shared-components', {
    keyPrefix: 'dialogAddSecurityOperators',
    useSuspense: false,
  })
  const { closeDialog } = useDialog()

  const { jwt } = useJwt()
  const formMethods = useForm<AddSecurityOperatorFormValues>({
    defaultValues: {
      selectedOperators: [],
    },
  })

  const { data: allPartyOperators = [], isLoading: isLoadingAllPartyOperators } =
    PartyQueries.useGetUsersList(
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
    closeDialog()
    onSubmit(selectedOperators)
  }

  return (
    <Dialog aria-labelledby={ariaLabelId} open onClose={closeDialog} fullWidth>
      <FormProvider {...formMethods}>
        <Box component="form" noValidate onSubmit={formMethods.handleSubmit(_onSubmit)}>
          <DialogTitle id={ariaLabelId}>{t('title')}</DialogTitle>

          <DialogContent>
            <Box>
              <RHFAutocompleteMultiple
                focusOnMount
                label={t('content.autocompleteLabel')}
                sx={{ mt: 6, mb: 0 }}
                name="selectedOperators"
                options={options}
                loading={isLoadingAllPartyOperators}
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
