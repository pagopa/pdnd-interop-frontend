import { useDialog } from '@/stores'
import { useTranslation } from 'react-i18next'
import React from 'react'
import type { DialogClonePurposeProps } from '@/types/dialog.types'
import { PurposeMutations } from '@/api/purpose'
import { useNavigate } from '@/router'
import { FormProvider, useForm } from 'react-hook-form'
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
import { DialogClonePurposeEServiceAutocomplete } from './DialogClonePurposeEServiceAutocomplete'

type ClonePurposeFormValues = {
  eserviceId: string
}

export const DialogClonePurpose: React.FC<DialogClonePurposeProps> = ({ purposeId, eservice }) => {
  const ariaLabelId = React.useId()
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })
  const { t } = useTranslation('shared-components', {
    keyPrefix: 'dialogClonePurpose',
  })
  const navigate = useNavigate()
  const { closeDialog } = useDialog()
  const { mutate: clonePurpose } = PurposeMutations.useClone()

  const formMethods = useForm<ClonePurposeFormValues>({
    defaultValues: {
      eserviceId: eservice.id,
    },
  })

  const onSubmit = ({ eserviceId }: ClonePurposeFormValues) => {
    clonePurpose(
      { purposeId: purposeId, eserviceId: eserviceId },
      {
        onSuccess({ purposeId }) {
          navigate('SUBSCRIBE_PURPOSE_SUMMARY', { params: { purposeId } })
          closeDialog()
        },
      }
    )
  }
  return (
    <Dialog aria-labelledby={ariaLabelId} open onClose={closeDialog} maxWidth="md" fullWidth>
      <FormProvider {...formMethods}>
        <Box component="form" noValidate onSubmit={formMethods.handleSubmit(onSubmit)}>
          <DialogTitle id={ariaLabelId}>{t('title')}</DialogTitle>

          <DialogContent>
            <Stack spacing={2}>
              <Typography variant="body1">{t('description')}</Typography>
              <DialogClonePurposeEServiceAutocomplete preselectedEservice={eservice} />
            </Stack>
          </DialogContent>

          <DialogActions>
            <Button type="button" variant="outlined" onClick={closeDialog}>
              {tCommon('cancel')}
            </Button>
            <Button variant="contained" type="submit">
              {tCommon('confirm')}
            </Button>
          </DialogActions>
        </Box>
      </FormProvider>
    </Dialog>
  )
}
