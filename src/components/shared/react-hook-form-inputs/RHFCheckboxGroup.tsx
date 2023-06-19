import React from 'react'
import { FormControlLabel, FormGroup, FormLabel, Checkbox, type SxProps } from '@mui/material'
import { InputWrapper } from '../InputWrapper'
import { Controller, useFormContext } from 'react-hook-form'
import type { InputOption } from '@/types/common.types'
import type { ControllerProps } from 'react-hook-form/dist/types'
import { useTranslation } from 'react-i18next'
import { mapValidationErrorMessages } from '@/utils/validation.utils'

export type RHFCheckboxGroupProps = {
  sx?: SxProps
  label?: string
  options: Array<InputOption & { disabled?: boolean }>
  name: string
  infoLabel?: string
  rules?: ControllerProps['rules']
  onValueChange?: (value: Array<string>) => void
}

export const RHFCheckboxGroup: React.FC<RHFCheckboxGroupProps> = ({
  sx,
  name,
  label,
  options,
  infoLabel,
  rules,
  onValueChange,
}) => {
  const { formState } = useFormContext()
  const { t } = useTranslation()

  if (!options || options.length === 0) {
    return null
  }

  const error = formState.errors[name]?.message as string | undefined

  return (
    <InputWrapper error={error} sx={sx} infoLabel={infoLabel}>
      {label && <FormLabel component="legend">{label}</FormLabel>}
      <FormGroup>
        <Controller
          name={name}
          rules={mapValidationErrorMessages(rules, t)}
          render={({ field }) => {
            const onChange = (e: React.SyntheticEvent) => {
              const target = e.target as HTMLInputElement
              const prevValue = (field.value ?? []) as Array<string>

              const newValue = prevValue?.includes(target.name)
                ? prevValue.filter((v: unknown) => v !== target.name)
                : [...prevValue, target.name]

              field.onChange(newValue)
              if (onValueChange) onValueChange(newValue)
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
                        checked={field.value?.includes(o.value) ?? false}
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
