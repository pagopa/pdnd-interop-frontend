import React from 'react'
import { useForm } from 'react-hook-form'
import { StepperStepComponentProps } from '../../types'
import { StyledForm } from './Shared/StyledForm'
import { StyledInputControlledSelect } from './Shared/StyledInputControlledSelect'
import { requiredValidationPattern } from '../lib/validation'
import { EServiceWriteActions } from './Shared/EServiceWriteActions'
import { StyledIntro } from './Shared/StyledIntro'
import { StyledInputControlledText } from './Shared/StyledInputControlledText'

export function EServiceWriteStep3Agreement({ forward, back }: StepperStepComponentProps) {
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

      <StyledInputControlledText
        name="load-estimate"
        label="Soglia di carico ammesso (richiesto)"
        infoLabel="Calcolata in numero di richieste al giorno sostenibili per richiesta di fruizione"
        type="number"
        defaultValue="20000"
        control={control}
        rules={{ required: requiredValidationPattern }}
        errors={errors}
      />

      <EServiceWriteActions
        back={{ label: 'Indietro', onClick: back }}
        forward={{ label: 'Salva bozza e prosegui' }}
      />
    </StyledForm>
  )
}
