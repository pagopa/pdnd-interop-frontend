import React, { useId } from 'react'
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select as MUISelect,
  type SelectProps as MUISelectProps,
  type SelectChangeEvent,
} from '@mui/material'
import { InputWrapper } from '../InputWrapper'
import { Controller, useFormContext } from 'react-hook-form'
import type { InputOption } from '@/types/common.types'
import type { ControllerProps } from 'react-hook-form/dist/types'
import { useTranslation } from 'react-i18next'
import { getAriaAccessibilityInputProps, mapValidationErrorMessages } from '@/utils/form.utils'
export type RHFSelectProps = Omit<MUISelectProps, 'onChange' | 'label' | 'value'> & {
  name: string
  options: Array<InputOption & { disabled?: boolean }>
  label?: string
  infoLabel?: React.ReactNode
  rules?: ControllerProps['rules']
  onValueChange?: (value: string | number) => void
  emptyLabel?: string
}
export const RHFSelect: React.FC<RHFSelectProps> = ({
  sx,
  name,
  options,
  label,
  infoLabel,
  rules,
  onValueChange,
  emptyLabel,
  disabled,
  size = 'small',
  ...props
}) => {
  const { formState } = useFormContext()
  const { t } = useTranslation()
  const labelId = useId()
  const error = formState.errors[name]?.message as string | undefined
  const { accessibilityProps, ids } = getAriaAccessibilityInputProps(name, {
    infoLabel,
    error,
  })
  return (
    <InputWrapper error={error} sx={sx} infoLabel={infoLabel} {...ids}>
      <FormControl fullWidth error={!!error} size={size} disabled={disabled}>
        <InputLabel id={labelId}>{label}</InputLabel>
        <Controller
          name={name}
          rules={mapValidationErrorMessages(rules, t)}
          render={({ field: { ref, onChange, ...fieldProps } }) => (
            <MUISelect
              {...props}
              {...fieldProps}
              labelId={labelId}
              id={name}
              label={label}
              inputProps={{
                ...props.inputProps,
                ...accessibilityProps,
              }}
              onChange={(e: SelectChangeEvent<unknown>) => {
                const value = e.target.value as string | number
                onChange(value)
                if (onValueChange) onValueChange(value)
              }}
              inputRef={ref}
              disabled={disabled}
            >
              {options.length > 0 ? (
                options.map((option, index) => (
                  <MenuItem
                    key={`${name}-${option.value}-${index}`}
                    value={option.value}
                    disabled={option.disabled}
                  >
                    {option.label}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="">{emptyLabel ?? ''}</MenuItem>
              )}
            </MUISelect>
          )}
        />
      </FormControl>
    </InputWrapper>
  )
}
