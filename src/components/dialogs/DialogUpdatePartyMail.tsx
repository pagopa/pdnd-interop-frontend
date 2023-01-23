import React from 'react'
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { DialogUpdatePartyMailProps } from '@/types/dialog.types'
import { useDialog } from '@/contexts'
import { object, string } from 'yup'
import { FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { TextField } from '../shared/ReactHookFormInputs'
import { PartyMutations } from '@/api/party/party.hooks'
import { useJwt } from '@/hooks/useJwt'
import isEqual from 'lodash/isEqual'

type UpdatePartyMailFormValues = {
  contactEmail: string
  description: string
}

export const DialogUpdatePartyMail: React.FC<DialogUpdatePartyMailProps> = ({ defaultValues }) => {
  const ariaLabelId = React.useId()
  const ariaDescriptionId = React.useId()

  const { t } = useTranslation('shared-components', { keyPrefix: 'dialogUpdatePartyMail' })
  const { t: tCommon } = useTranslation('common')
  const { closeDialog } = useDialog()
  const { jwt } = useJwt()

  const { mutateAsync: updateMail } = PartyMutations.useUpdateMail()

  const validationSchema = object({
    contactEmail: string().email().required(),
    description: string(),
  })

  const formMethods = useForm<UpdatePartyMailFormValues>({
    resolver: yupResolver(validationSchema),
    defaultValues: defaultValues ?? { contactEmail: '', description: '' },
  })

  const onSubmit = async (values: UpdatePartyMailFormValues) => {
    if (!jwt?.organizationId) return
    // Updates only when description or email changed
    if (!isEqual(defaultValues, values)) {
      await updateMail({ partyId: jwt.organizationId, ...values })
    }
    closeDialog()
  }

  return (
    <Dialog aria-labelledby={ariaLabelId} open onClose={closeDialog} fullWidth maxWidth="md">
      <FormProvider {...formMethods}>
        <Box component="form" onSubmit={formMethods.handleSubmit(onSubmit)}>
          <DialogTitle id={ariaLabelId}>{t('title')}</DialogTitle>
          <DialogContent>
            <Typography id={ariaDescriptionId}>{t('subtitle')}</Typography>

            <TextField
              sx={{ mt: 2, mb: 0 }}
              focusOnMount
              name="contactEmail"
              label={t('content.mailAddressField.label')}
            />
            <TextField
              sx={{ mt: 2, mb: 0 }}
              name="description"
              label={t('content.descriptionField.label')}
              infoLabel={t('content.descriptionField.infoLabel')}
              inputProps={{ maxLength: 250 }}
            />
            <Alert sx={{ mt: 2 }} severity="warning">
              {t('alertLabel')}
            </Alert>
          </DialogContent>

          <DialogActions>
            <Button type="button" variant="outlined" onClick={closeDialog}>
              {tCommon('actions.cancel')}
            </Button>
            <Button variant="contained" type="submit">
              {tCommon('actions.edit')}
            </Button>
          </DialogActions>
        </Box>
      </FormProvider>
    </Dialog>
  )
}
