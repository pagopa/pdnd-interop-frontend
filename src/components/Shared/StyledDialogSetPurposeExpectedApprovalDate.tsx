import React, { FunctionComponent } from 'react'
import { object, date } from 'yup'
import { Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material'
import { Unstable_TrapFocus as TrapFocus } from '@mui/base'
import { Box } from '@mui/system'
import { StyledButton } from './StyledButton'
import { DialogSetPurposeExpectedApprovalDateProps } from '../../../types'
import { useCloseDialog } from '../../hooks/useCloseDialog'
import { StyledForm } from './StyledForm'
import { useFormik } from 'formik'
import { getFetchOutcome } from '../../lib/error-utils'
import { StyledInputStaticDatePicker } from './StyledInputStaticDatePicker'

type ApprovalDateProps = {
  expectedApprovalDate: Date
}

export const StyledDialogSetPurposeExpectedApprovalDate: FunctionComponent<DialogSetPurposeExpectedApprovalDateProps> =
  ({ purposeId, versionId, approvalDate, runAction }) => {
    const { closeDialog } = useCloseDialog()

    const onSubmit = async (data: ApprovalDateProps) => {
      const dataToPost = { ...data }
      const { response } = await runAction({
        path: {
          endpoint: 'PURPOSE_VERSION_WAITING_FOR_APPROVAL_UPDATE',
          endpointParams: { purposeId, versionId },
        },
        config: { data: dataToPost },
      })

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
      <TrapFocus open>
        <Dialog open={true} onClose={closeDialog} aria-describedby="Modale per azione" fullWidth>
          <StyledForm onSubmit={formik.handleSubmit}>
            <DialogTitle>Imposta data di completamento stimata</DialogTitle>

            <DialogContent>
              <Typography>
                Questa data verrà indicata all&rsquo;ente fruitore come data di attivazione della
                finalità. Potrai aggiornarla in qualsiasi momento. Nota bene: questa modifica verrà
                immediatamente notificata all&rsquo;ente fruitore
              </Typography>
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
                Annulla
              </StyledButton>
              <StyledButton variant="contained" type="submit">
                Imposta
              </StyledButton>
            </DialogActions>
          </StyledForm>
        </Dialog>
      </TrapFocus>
    )
  }
