import React, { FunctionComponent } from 'react'
import { object, date } from 'yup'
import { Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { StyledButton } from './StyledButton'
import { DialogSetPurposeExpectedApprovalDateProps } from '../../../types'
import { useCloseDialog } from '../../hooks/useCloseDialog'
import { StyledForm } from './StyledForm'
import { useFormik } from 'formik'
import { getFetchOutcome } from '../../lib/error-utils'
import { StyledInputStaticDatePicker } from './StyledInputStaticDatePicker'
import { RunActionOutput } from '../../hooks/useFeedback'
import { useTranslation } from 'react-i18next'

type ApprovalDateProps = {
  expectedApprovalDate: Date
}

export const StyledDialogSetPurposeExpectedApprovalDate: FunctionComponent<
  DialogSetPurposeExpectedApprovalDateProps
> = ({ purposeId, versionId, approvalDate, runAction }) => {
  const { t } = useTranslation('shared-components')
  const { closeDialog } = useCloseDialog()

  const onSubmit = async (data: ApprovalDateProps) => {
    const dataToPost = { ...data }
    const { response } = (await runAction({
      path: {
        endpoint: 'PURPOSE_VERSION_WAITING_FOR_APPROVAL_UPDATE',
        endpointParams: { purposeId, versionId },
      },
      config: { data: dataToPost },
    })) as RunActionOutput

    if (getFetchOutcome(response) === 'success') {
      closeDialog()
    }
  }

  const formik = useFormik({
    initialValues: { expectedApprovalDate: approvalDate ? new Date(approvalDate) : new Date() },
    validationSchema: object({ expectedApprovalDate: date().required() }),
    onSubmit,
  })

  return (
    <Dialog open onClose={closeDialog} aria-describedby={t('ariaLabelledBy')} fullWidth>
      <StyledForm onSubmit={formik.handleSubmit}>
        <DialogTitle>{t('title')}</DialogTitle>

        <DialogContent>
          <Typography>{t('content.message')}</Typography>
          <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderBottom: 1, borderColor: 'divider' }}>
            <StyledInputStaticDatePicker
              sx={{ my: 0 }}
              name="expectedApprovalDate"
              value={formik.values.expectedApprovalDate}
              error={formik.errors.expectedApprovalDate as string}
              setFieldValue={formik.setFieldValue}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <StyledButton variant="outlined" onClick={closeDialog}>
            {t('actions.cancelLabel')}
          </StyledButton>
          <StyledButton variant="contained" type="submit">
            {t('actions.confirmLabel')}
          </StyledButton>
        </DialogActions>
      </StyledForm>
    </Dialog>
  )
}
