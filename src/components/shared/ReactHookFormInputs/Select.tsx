import React, { useId } from 'react'
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select as MUISelect,
  SelectProps as MUISelectProps,
} from '@mui/material'
import { InputWrapper } from './InputWrapper'
import { Controller, useFormContext } from 'react-hook-form'

export type SelectProps = MUISelectProps & {
  name: string
  options: Array<{ label: string; value: string | number }>
  focusOnMount?: boolean
  infoLabel?: string
  emptyLabel?: string
}

export const Select: React.FC<SelectProps> = ({
  sx,
  name,
  options,
  label,
  focusOnMount,
  infoLabel,
  emptyLabel,
  ...props
}) => {
  const { formState, control } = useFormContext()
  const labelId = useId()

  const error = formState.errors[name]?.message as string | undefined

  return (
    <InputWrapper name={name} error={error} sx={sx} infoLabel={infoLabel}>
      <FormControl fullWidth>
        <InputLabel id={labelId} shrink>
          {label}
        </InputLabel>
        <Controller
          control={control}
          name={name}
          render={({ field }) => (
            <MUISelect
              {...props}
              {...field}
              error={!!error}
              label={label}
              labelId={labelId}
              autoFocus={focusOnMount}
            >
              {options.length > 0 ? (
                options.map((o, i) => (
                  <MenuItem key={i} value={o.value}>
                    {o.label}
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
