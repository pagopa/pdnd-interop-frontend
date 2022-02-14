import React, { FunctionComponent, useContext } from 'react'
import { useFormik } from 'formik'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Unstable_TrapFocus as TrapFocus,
} from '@mui/material'
import { StyledButton } from './StyledButton'
import { DialogCreateSecurityOperatorProps, Party, UserOnCreate } from '../../../types'
import { useCloseDialog } from '../../hooks/useCloseDialog'
import { Box } from '@mui/system'
import { StyledForm } from './StyledForm'
import { UserCreationForm } from './UserCreationForm'
import { PartyContext } from '../../lib/context'
import {
  userCreationFormContract,
  userCreationFormInitialValues,
  userCreationFormValidationSchema,
} from '../../config/forms'
import { useFeedback } from '../../hooks/useFeedback'

export const StyledDialogCreateSecurityOperator: FunctionComponent<DialogCreateSecurityOperatorProps> =
  () => {
    const { party } = useContext(PartyContext)
    const { runAction } = useFeedback()
    const { closeDialog } = useCloseDialog()

    const onSubmit = async (operator: Partial<UserOnCreate>) => {
      const userData = {
        ...operator,
        role: 'OPERATOR',
        product: 'interop',
        productRole: 'security',
      }
      const { institutionId } = party as Party
      const dataToPost = { users: [userData], institutionId, contract: userCreationFormContract }
      await runAction(
        { path: { endpoint: 'OPERATOR_CREATE' }, config: { data: dataToPost } },
        { suppressToast: false }
      )
      closeDialog()
    }

    const formik = useFormik({
      initialValues: userCreationFormInitialValues,
      validationSchema: userCreationFormValidationSchema,
      onSubmit: onSubmit,
      validateOnChange: false,
      validateOnBlur: false,
    })

    const handleSubmit = (e?: React.FormEvent<HTMLFormElement> | undefined) => {
      formik.handleSubmit(e)
      closeDialog()
    }

    return (
      <TrapFocus open>
        <Dialog open={true} onClose={closeDialog} aria-describedby="Modale per azione" fullWidth>
          <StyledForm onSubmit={handleSubmit}>
            <DialogTitle>Crea operatore di sicurezza</DialogTitle>

            <DialogContent>
              <Typography>
                Se non hai trovato l&rsquo;operatore che cerchi nell&rsquo;elenco di quelli che si
                possono aggiungere al client, puoi crearlo qui. Una volta creata correttamente
                l&rsquo;utenza, potrai aggiungerlo al client
              </Typography>
              <Box sx={{ mt: 3 }}>
                <UserCreationForm
                  handleChange={formik.handleChange}
                  values={formik.values}
                  errors={formik.errors}
                  inputSx={{ my: 2 }}
                />
              </Box>
            </DialogContent>

            <DialogActions>
              <StyledButton variant="outlined" onClick={closeDialog}>
                Annulla
              </StyledButton>
              <StyledButton variant="contained" type="submit">
                Crea
              </StyledButton>
            </DialogActions>
          </StyledForm>
        </Dialog>
      </TrapFocus>
    )
  }
