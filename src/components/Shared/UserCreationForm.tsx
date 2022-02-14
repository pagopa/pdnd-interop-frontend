import React from 'react'
import { Grid } from '@mui/material'
import { UserOnCreate } from '../../../types'
import { Contained } from './Contained'
import { StyledInputControlledText } from './StyledInputControlledText'
import { FormikErrors } from 'formik'
import { SxProps } from '@mui/system'

type UserCreationFormProps = {
  handleChange: (e: React.ChangeEvent) => void
  values: Partial<UserOnCreate>
  errors: FormikErrors<Partial<UserOnCreate>>
  inputSx?: SxProps
}

export const UserCreationForm: React.FunctionComponent<UserCreationFormProps> = ({
  handleChange,
  values,
  errors,
  inputSx = { my: 4 },
}) => {
  return (
    <Contained>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <StyledInputControlledText
            focusOnMount={true}
            sx={inputSx}
            label="Nome*"
            name="name"
            onChange={handleChange}
            value={values.name}
            error={errors.name}
          />
        </Grid>

        <Grid item xs={6}>
          <StyledInputControlledText
            sx={inputSx}
            label="Cognome*"
            name="surname"
            onChange={handleChange}
            value={values.surname}
            error={errors.surname}
          />
        </Grid>

        <Grid item xs={12}>
          <StyledInputControlledText
            sx={inputSx}
            label="Codice Fiscale*"
            name="taxCode"
            onChange={handleChange}
            value={values.taxCode}
            error={errors.taxCode}
          />
        </Grid>

        <Grid item xs={12}>
          <StyledInputControlledText
            type="email"
            infoLabel="Inserisci l'indirizzo email ad uso aziendale utilizzato per l'Ente"
            sx={inputSx}
            label="Email ad uso aziendale*"
            name="email"
            onChange={handleChange}
            value={values.email}
            error={errors.email}
          />
        </Grid>
      </Grid>
    </Contained>
  )
}
