import React from 'react'
import { useForm } from 'react-hook-form'
import { StepperStepComponentProps } from '../../types'
import { EServiceWriteStepProps } from '../views/EServiceWrite'
import { StyledForm } from './Shared/StyledForm'
import { StyledInputControlledSelect } from './Shared/StyledInputControlledSelect'
import { requiredValidationPattern } from '../lib/validation'
import { EServiceWriteActions } from './Shared/EServiceWriteActions'
import { StyledIntro } from './Shared/StyledIntro'

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

  const onSubmit = () => {
    forward()
  }

  return (
    <StyledForm onSubmit={handleSubmit(onSubmit)}>
      <StyledIntro variant="h2" sx={{ mb: 0, pb: 0 }}>
        {{
          title: 'Template accordo di interoperabilità',
        }}
      </StyledIntro>

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

      <EServiceWriteActions
        back={{ label: 'Indietro', onClick: back }}
        forward={{ label: 'Salva bozza e prosegui' }}
      />
    </StyledForm>
  )
}
