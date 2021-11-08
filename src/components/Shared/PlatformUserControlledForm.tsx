import React from 'react'
import { Box } from '@mui/system'
import {
  emailValidationPattern,
  requiredValidationPattern,
  taxCodeValidationPattern,
} from '../../lib/validation'
import { StyledInputControlledText } from './StyledInputControlledText'

type PlatformUserControlledFormProps = {
  prefix: string
  control: any
  errors: any
}

export function PlatformUserControlledForm({
  prefix,
  control,
  errors,
}: PlatformUserControlledFormProps) {
  return (
    <Box sx={{ py: 2 }}>
      <Box sx={{ py: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ mr: 2, flexGrow: 1 }}>
          <StyledInputControlledText
            label="Nome*"
            name={`${prefix}.name`}
            control={control}
            rules={{ required: requiredValidationPattern }}
            errors={errors}
          />
        </Box>
        <Box sx={{ ml: 2, flexGrow: 1 }}>
          <StyledInputControlledText
            label="Cognome*"
            name={`${prefix}.surname`}
            control={control}
            rules={{ required: requiredValidationPattern }}
            errors={errors}
          />
        </Box>
      </Box>
      <Box sx={{ py: 2 }}>
        <StyledInputControlledText
          label="Codice Fiscale*"
          name={`${prefix}.taxCode`}
          control={control}
          rules={{ required: requiredValidationPattern, pattern: taxCodeValidationPattern }}
          errors={errors}
        />
      </Box>
      <Box sx={{ py: 2 }}>
        <StyledInputControlledText
          label="Email ad uso aziendale*"
          name={`${prefix}.email`}
          type="email"
          control={control}
          rules={{ required: requiredValidationPattern, pattern: emailValidationPattern }}
          errors={errors}
          infoLabel="Inserisci l'indirizzo email ad uso aziendale utilizzato per l'Ente"
        />
      </Box>
    </Box>
  )
}
