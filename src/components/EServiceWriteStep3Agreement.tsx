import React from 'react'
import noop from 'lodash/noop'
import { StepperStepComponentProps } from '../../types'
import { EServiceWriteStepProps } from '../views/EServiceWrite'
import { StyledInputSelect } from './Shared/StyledInputSelect'
import { StyledIntro } from './Shared/StyledIntro'
import { StyledButton } from './Shared/StyledButton'
import { StyledForm } from './Shared/StyledForm'
import { Box } from '@mui/system'

export function EServiceWriteStep3Agreement({
  forward,
  back,
}: StepperStepComponentProps & EServiceWriteStepProps) {
  const options = [
    { value: '1', label: 'Template pubbliche amministrazioni' },
    { value: '2', label: 'Template privati' },
    { value: '3', label: 'Template ...' },
  ]

  const submit = (e: any) => {
    e.preventDefault()

    forward()
  }

  return (
    <React.Fragment>
      <StyledForm onSubmit={submit}>
        <StyledIntro variant="h1">
          {{
            title: 'Crea e-service: accordo di interoperabilità*',
            description: 'Seleziona il template di accordo che intendi proporre al fruitore',
          }}
        </StyledIntro>

        <StyledInputSelect
          id="accordo"
          label="Seleziona template"
          disabled={false}
          options={options}
          onChange={noop}
          currentValue={options[0].value}
        />

        <Box sx={{ mt: 4, display: 'flex' }}>
          <StyledButton sx={{ mr: 2 }} variant="contained" type="submit">
            Salva bozza e prosegui
          </StyledButton>
          <StyledButton variant="outlined" onClick={back}>
            Indietro
          </StyledButton>
        </Box>
      </StyledForm>
    </React.Fragment>
  )
}
