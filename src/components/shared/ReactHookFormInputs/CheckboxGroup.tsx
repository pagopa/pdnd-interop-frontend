import React from 'react'
import { FormControlLabel, FormGroup, FormLabel, Checkbox, SxProps } from '@mui/material'
import { InputWrapper } from '../InputWrapper'
import { Controller, useFormContext } from 'react-hook-form'
import { InputOption } from '@/types/common.types'

export type CheckboxGroupProps = {
  sx?: SxProps
  label: string
  options: Array<InputOption & { disabled?: boolean }>
  name: string
  infoLabel?: string
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  sx,
  name,
  label,
  options,
  infoLabel,
}) => {
  const { formState, control } = useFormContext()

  if (!options || options.length === 0) {
    return null
  }

  const error = formState.errors[name]?.message as string | undefined

  return (
    <InputWrapper name={name} error={error} sx={sx} infoLabel={infoLabel}>
      <FormLabel component="legend">{label}</FormLabel>
      <FormGroup>
        <Controller
          control={control}
          name={name}
          render={({ field }) => {
            const onChange = (e: React.SyntheticEvent) => {
              const target = e.target as HTMLInputElement
              const prevValue = field.value ?? []

              const newValue = prevValue?.includes(target.name)
                ? prevValue.filter((v: unknown) => v !== target.name)
                : [...prevValue, target.name]

              field.onChange(newValue)
            }

            return (
              <>
                {options.map((o) => (
                  <FormControlLabel
                    disabled={o.disabled}
                    key={o.value}
                    value={o.value}
                    control={
                      <Checkbox
                        checked={field.value.includes(o.value)}
                        onChange={onChange}
                        name={String(o.value)}
                      />
                    }
                    label={o.label}
                    sx={{ mr: 3 }}
                  />
                ))}
              </>
            )
          }}
        />
      </FormGroup>
    </InputWrapper>
  )
}
