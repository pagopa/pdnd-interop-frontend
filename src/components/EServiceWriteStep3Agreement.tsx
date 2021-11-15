import React from 'react'
import { useForm } from 'react-hook-form'
import { StepperStepComponentProps } from '../../types'
import { EServiceWriteStepProps } from '../views/EServiceWrite'
import { StyledIntro } from './Shared/StyledIntro'
import { StyledButton } from './Shared/StyledButton'
import { StyledForm } from './Shared/StyledForm'
import { Box } from '@mui/system'
import { StyledInputControlledSelect } from './Shared/StyledInputControlledSelect'
import { requiredValidationPattern } from '../lib/validation'

export function EServiceWriteStep3Agreement({
  forward,
  back,
}: StepperStepComponentProps & EServiceWriteStepProps) {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm()

  const options = [
    { value: '1', label: 'Template pubbliche amministrazioni' },
    { value: '2', label: 'Template privati' },
    { value: '3', label: 'Template ...' },
  ]

  const onSubmit = (_: any) => {
    forward()
  }

  return (
    <React.Fragment>
      <StyledIntro variant="h1">
        {{
          title: 'Crea e-service: accordo di interoperabilità*',
          description: 'Seleziona il template di accordo che intendi proporre al fruitore',
        }}
      </StyledIntro>

      <StyledForm onSubmit={handleSubmit(onSubmit)}>
        <StyledInputControlledSelect
          focusOnMount={true}
          name="accordo"
          label="Seleziona template"
          disabled={false}
          options={options}
          control={control}
          rules={{ required: requiredValidationPattern }}
          errors={errors}
          defaultValue={options[0].value}
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
