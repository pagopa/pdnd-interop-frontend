import { useDialog } from '@/stores'
import { useTranslation } from 'react-i18next'
import React from 'react'
import type { DialogClonePurposeProps } from '@/types/dialog.types'
import { PurposeMutations, PurposeQueries } from '@/api/purpose'
import { useNavigate } from '@/router'
import { FormProvider, useForm } from 'react-hook-form'
import {
  Alert,
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
import { useQuery } from '@tanstack/react-query'

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
  const { data: purpose, isLoading: isLoadingPurpose } = useQuery({
    ...PurposeQueries.getSingle(purposeId),
  })

  const formMethods = useForm<ClonePurposeFormValues>({
    defaultValues: {
      eserviceId: eservice.id,
    },
  })

  const [selectedEServicePersonalData, setSelectedEServicePersonalData] = React.useState<
    boolean | undefined
  >(eservice.personalData)

  const incompatiblePersonalData = () => {
    if (isLoadingPurpose) return false
    if (selectedEServicePersonalData === undefined || purpose?.eservice.personalData === undefined)
      return false
    else if (selectedEServicePersonalData !== purpose.eservice.personalData) return true
    else return false
  }

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

  const handleEServiceChange = (personalData: boolean | undefined) => {
    setSelectedEServicePersonalData(personalData)
  }

  return (
    <Dialog aria-labelledby={ariaLabelId} open onClose={closeDialog} maxWidth="md" fullWidth>
      <FormProvider {...formMethods}>
        <Box component="form" noValidate onSubmit={formMethods.handleSubmit(onSubmit)}>
          <DialogTitle id={ariaLabelId}>{t('title')}</DialogTitle>

          <DialogContent>
            <Stack spacing={2}>
              <Typography variant="body1">{t('description')}</Typography>
              <DialogClonePurposeEServiceAutocomplete
                preselectedEservice={eservice}
                onEServiceChange={handleEServiceChange}
              />
            </Stack>
            {incompatiblePersonalData() && (
              <Alert severity="warning" sx={{ mt: 3 }}>
                <Typography sx={{ fontWeight: '600' }}>{t('alertPersonalData.title')}</Typography>
                {t('alertPersonalData.description')}
              </Alert>
            )}
          </DialogContent>

          <DialogActions>
            <Button type="button" variant="outlined" onClick={closeDialog}>
              {tCommon('cancel')}
            </Button>
            <Button variant="contained" type="submit" disabled={incompatiblePersonalData()}>
              {tCommon('confirm')}
            </Button>
          </DialogActions>
        </Box>
      </FormProvider>
    </Dialog>
  )
}
