import type { DelegationTenant } from '@/api/api.generatedTypes'
import { AuthHooks } from '@/api/auth'
import { useNavigate } from '@/router'
import { useDialog } from '@/stores'
import type { DialogSelectAgreementConsumerProps } from '@/types/dialog.types'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { DialogSelectAgreementConsumerAutocomplete } from './DialogSelectAgreementConsumerAutocomplete'

type SelectAgreementConsumerFormValues = {
  consumerId: string
}

export const DialogSelectAgreementConsumer: React.FC<DialogSelectAgreementConsumerProps> = ({
  action,
  eserviceId,
  agreements,
}) => {
  const ariaLabelId = React.useId()
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })
  const { t } = useTranslation('shared-components', {
    keyPrefix: 'dialogSelectAgreementConsumer',
  })

  const navigate = useNavigate()
  const { closeDialog } = useDialog()
  const { jwt } = AuthHooks.useJwt()

  const formMethods = useForm<SelectAgreementConsumerFormValues>({
    defaultValues: {
      consumerId: jwt?.organizationId ?? undefined,
    },
  })

  const selectedConsumerId = formMethods.watch('consumerId')

  const handleSubmit = ({ consumerId }: SelectAgreementConsumerFormValues) => {
    const agreementId = agreements.find((agreement) => agreement.consumerId === consumerId)?.id

    if (!agreementId) return

    navigate('SUBSCRIBE_AGREEMENT_READ', {
      params: {
        agreementId: agreementId,
      },
    })
  }

  return (
    <Dialog aria-labelledby={ariaLabelId} open onClose={closeDialog} maxWidth="md" fullWidth>
      <FormProvider {...formMethods}>
        <Box component="form" noValidate onSubmit={formMethods.handleSubmit(handleSubmit)}>
          <DialogTitle id={ariaLabelId}>{t(`title.${action}`)}</DialogTitle>

          <DialogContent>
            <Stack spacing={2}>
              <Typography>{t(`description.${action}`)}</Typography>
              <DialogSelectAgreementConsumerAutocomplete
                eserviceId={eserviceId}
                preselectedConsumer={
                  jwt
                    ? ({
                        id: jwt?.organizationId,
                        name: jwt?.organization.name,
                      } as DelegationTenant)
                    : undefined
                }
                agreements={agreements}
                action={action}
              />
            </Stack>
          </DialogContent>

          <DialogActions>
            <Button type="button" variant="outlined" onClick={closeDialog}>
              {tCommon('cancel')}
            </Button>
            <Button variant="contained" type="submit" disabled={!selectedConsumerId}>
              {t(`actions.${action}`)}
            </Button>
          </DialogActions>
        </Box>
      </FormProvider>
    </Dialog>
  )
}
