import React, { useId } from 'react'
import {
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup as MUIRadioGroup,
  RadioGroupProps as MUIRadioGroupProps,
} from '@mui/material'
import { InputWrapper } from './InputWrapper'
import { Controller, useFormContext } from 'react-hook-form'
import { InputOption } from '@/types/common.types'

export type RadioGroupProps = MUIRadioGroupProps & {
  label: string
  options: Array<InputOption & { disabled?: boolean }>
  name: string
  infoLabel?: string
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  sx,
  name,
  label,
  options,
  infoLabel,
  ...props
}) => {
  const { formState, control } = useFormContext()
  const labelId = useId()

  if (!options || options.length === 0) {
    return null
  }

  const error = formState.errors[name]?.message as string | undefined

  return (
    <InputWrapper name={name} error={error} sx={sx} infoLabel={infoLabel}>
      <FormLabel id={labelId}>{label}</FormLabel>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <MUIRadioGroup aria-labelledby={labelId} {...props} {...field}>
            {options.map((o) => (
              <FormControlLabel
                disabled={o.disabled}
                key={o.value}
                value={o.value}
                control={<Radio />}
                label={o.label}
                sx={{ mr: 3 }}
              />
            ))}
          </MUIRadioGroup>
        )}
      />
    </InputWrapper>
  )
}
