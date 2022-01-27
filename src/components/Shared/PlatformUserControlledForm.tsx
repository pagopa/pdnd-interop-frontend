import React from 'react'
import { Grid } from '@mui/material'
import { StyledInputControlledTextFormik } from './StyledInputControlledTextFormik'
import { FormikErrors, FormikValues } from 'formik'

type PlatformUserControlledFormProps = {
  prefix: string
  errors: FormikErrors<FormikValues>
}

export function PlatformUserControlledForm({ prefix, errors }: PlatformUserControlledFormProps) {
  const name = `${prefix}.name`
  const surname = `${prefix}.surname`
  const taxCode = `${prefix}.taxCode`
  const email = `${prefix}.email`

  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <StyledInputControlledTextFormik
          focusOnMount={true}
          sx={{ my: 4 }}
          label="Nome*"
          name={name}
          error={errors[name] as string | undefined}
        />
      </Grid>

      <Grid item xs={6}>
        <StyledInputControlledTextFormik
          sx={{ my: 4 }}
          label="Cognome*"
          name={surname}
          error={errors[surname] as string | undefined}
        />
      </Grid>

      <Grid item xs={12}>
        <StyledInputControlledTextFormik
          sx={{ my: 4 }}
          label="Codice Fiscale*"
          name={taxCode}
          error={errors[taxCode] as string | undefined}
        />
      </Grid>

      <Grid item xs={12}>
        <StyledInputControlledTextFormik
          type="email"
          infoLabel="Inserisci l'indirizzo email ad uso aziendale utilizzato per l'Ente"
          sx={{ my: 4 }}
          label="Email ad uso aziendale*"
          name={email}
          error={errors[email] as string | undefined}
        />
      </Grid>
    </Grid>
  )
}
