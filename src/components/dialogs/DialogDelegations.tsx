import { useDialog } from '@/stores'
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Typography,
} from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from '@/router'
import { DelegationMutations } from '@/api/delegation'
import { EServiceMutations } from '@/api/eservice'
import { EServiceCreateDraftValues } from '@/pages/DelegationCreatePage/components/DelegationCreateForm'

type DialogDelegationsProps = {
  eserviceParams?: EServiceCreateDraftValues
  delegationParams: { eserviceId?: string; delegateId: string }
}

export const DialogDelegations: React.FC<DialogDelegationsProps> = ({
  eserviceParams,
  delegationParams,
}) => {
  const ariaLabelId = React.useId()

  const { t } = useTranslation('party', {
    keyPrefix: 'delegations.create.dialog',
  })

  const { closeDialog } = useDialog()

  const [isCheckboxChecked, setIsCheckboxChecked] = React.useState<boolean>(false)

  const { mutate: createProducerDelegation } = DelegationMutations.useCreateProducerDelegation()
  const { mutate: createProducerEserviceDraft } = EServiceMutations.useCreateDraft()

  const handleCheckBoxChange = () => {
    setIsCheckboxChecked((prev) => {
      return !prev
    })
  }

  const navigate = useNavigate()

  const onSubmit = () => {
    let createDelegationParams = {
      eserviceId: delegationParams?.eserviceId || '',
      delegateId: delegationParams?.delegateId,
    }
    if (eserviceParams) {
      createProducerEserviceDraft(eserviceParams, {
        onSuccess({ id }) {
          createDelegationParams = {
            eserviceId: id,
            delegateId: delegationParams?.delegateId,
          }
          createProducerDelegation(createDelegationParams)
        },
      })
    }
    createProducerDelegation(createDelegationParams)
    navigate('DELEGATIONS')
    closeDialog()
  }

  return (
    <Dialog aria-labelledby={ariaLabelId} open onClose={closeDialog} fullWidth maxWidth="sm">
      <Box component="form" onSubmit={onSubmit}>
        <DialogTitle id={ariaLabelId}>{t('title')}</DialogTitle>

        <DialogContent>
          <Typography variant="body1">{t('description')}</Typography>
        </DialogContent>
        <FormControlLabel
          key={'confirmationCheckbox'}
          value={isCheckboxChecked}
          onChange={handleCheckBoxChange}
          control={<Checkbox />}
          label={t('checkboxLabel')}
          sx={{ mx: 1 }}
        />

        <DialogActions>
          <Button type="button" variant="outlined" onClick={closeDialog}>
            {t('cancelLabel')}
          </Button>
          <Button variant="contained" type="submit" disabled={!isCheckboxChecked}>
            {t('proceedLabel')}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}
