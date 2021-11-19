import React from 'react'
import { Grid } from '@mui/material'
import {
  emailValidationPattern,
  requiredValidationPattern,
  taxCodeValidationPattern,
} from '../../lib/validation'
import { StyledInputControlledText } from './StyledInputControlledText'
import { Control, FieldValues } from 'react-hook-form'

type PlatformUserControlledFormProps = {
  prefix: string
  control: Control<FieldValues, Record<string, unknown>>
  errors: Record<string, unknown>
}

export function PlatformUserControlledForm({
  prefix,
  control,
  errors,
}: PlatformUserControlledFormProps) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <StyledInputControlledText
          sx={{ my: 4 }}
          focusOnMount={true}
          label="Nome*"
          name={`${prefix}.name`}
          control={control}
          rules={{ required: requiredValidationPattern }}
          errors={errors}
        />
      </Grid>

      <Grid item xs={6}>
        <StyledInputControlledText
          sx={{ my: 4 }}
          label="Cognome*"
          name={`${prefix}.surname`}
          control={control}
          rules={{ required: requiredValidationPattern }}
          errors={errors}
        />
      </Grid>

      <Grid item xs={12}>
        <StyledInputControlledText
          sx={{ my: 4 }}
          label="Codice Fiscale*"
          name={`${prefix}.taxCode`}
          control={control}
          rules={{ required: requiredValidationPattern, pattern: taxCodeValidationPattern }}
          errors={errors}
        />
      </Grid>

      <Grid item xs={12}>
        <StyledInputControlledText
          sx={{ my: 4 }}
          label="Email ad uso aziendale*"
          name={`${prefix}.email`}
          type="email"
          control={control}
          rules={{ required: requiredValidationPattern, pattern: emailValidationPattern }}
          errors={errors}
          infoLabel="Inserisci l'indirizzo email ad uso aziendale utilizzato per l'Ente"
        />
      </Grid>
    </Grid>
  )
}
