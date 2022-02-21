import React, { FunctionComponent } from 'react'
import { object, date } from 'yup'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Unstable_TrapFocus as TrapFocus,
} from '@mui/material'
import { StyledButton } from './StyledButton'
import { DialogSetPurposeExpectedApprovalDateProps } from '../../../types'
import { useCloseDialog } from '../../hooks/useCloseDialog'
import { Box } from '@mui/system'
import { StyledForm } from './StyledForm'
import { useFormik } from 'formik'
import { getFetchOutcome } from '../../lib/error-utils'
import { StyledInputStaticDatePicker } from './StyledInputStaticDatePicker'
import { getBits } from '../../lib/router-utils'
import { useLocation } from 'react-router-dom'

type ApprovalDateProps = {
  approvalDate: Date
}

export const StyledDialogSetPurposeExpectedApprovalDate: FunctionComponent<DialogSetPurposeExpectedApprovalDateProps> =
  ({ id, approvalDate, runAction }) => {
    const { closeDialog } = useCloseDialog()

    const location = useLocation()
    const bits = getBits(location)
    const purposeId = bits[bits.length - 1]

    const onSubmit = async (data: ApprovalDateProps) => {
      const dataToPost = { ...data, id }
      const { response } = await runAction(
        {
          path: { endpoint: 'PURPOSE_VERSION_DRAFT_UPDATE', endpointParams: { purposeId } },
          config: { data: dataToPost },
        },
        { suppressToast: false }
      )

      if (getFetchOutcome(response) === 'success') {
        closeDialog()
      }
    }

    const formik = useFormik({
      initialValues: { approvalDate: approvalDate ? new Date(approvalDate) : new Date() },
      validationSchema: object({ approvalDate: date().required() }),
      onSubmit,
    })

    return (
      <TrapFocus open>
        <Dialog open={true} onClose={closeDialog} aria-describedby="Modale per azione" fullWidth>
          <StyledForm onSubmit={formik.handleSubmit}>
            <DialogTitle>Imposta data di approvazione stimata</DialogTitle>

            <DialogContent>
              <Typography>
                Questa data verrà indicata all&rsquo;ente fruitore come data di attivazione della
                finalità. Potrai aggiornarla in qualsiasi momento. Nota bene: questa modifica verrà
                immediatamente notificata all&rsquo;ente fruitore
              </Typography>
              <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderBottom: 1, borderColor: 'divider' }}>
                <StyledInputStaticDatePicker
                  sx={{ my: 0 }}
                  name="approvalDate"
                  value={formik.values.approvalDate}
                  error={formik.errors.approvalDate as string}
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
