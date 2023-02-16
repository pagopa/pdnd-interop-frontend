import React, { useId } from 'react'
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select as MUISelect,
  SelectProps as MUISelectProps,
} from '@mui/material'
import { InputWrapper } from '../InputWrapper'
import { Controller, useFormContext } from 'react-hook-form'
import { InputOption } from '@/types/common.types'
import { ControllerProps } from 'react-hook-form/dist/types'
import { useTranslation } from 'react-i18next'
import { mapValidationErrorMessages } from '@/utils/validation.utils'

export type SelectProps = Omit<MUISelectProps, 'onChange'> & {
  name: string
  options: Array<InputOption>
  focusOnMount?: boolean
  infoLabel?: string
  emptyLabel?: string
  rules?: ControllerProps['rules']
  onValueChange?: (value: string) => void
}

export const Select: React.FC<SelectProps> = ({
  sx,
  name,
  options,
  label,
  focusOnMount,
  infoLabel,
  emptyLabel,
  rules,
  onValueChange,
  ...props
}) => {
  const { formState } = useFormContext()
  const labelId = useId()
  const { t } = useTranslation()

  const error = formState.errors[name]?.message as string | undefined

  return (
    <InputWrapper error={error} sx={sx} infoLabel={infoLabel}>
      <FormControl fullWidth>
        <InputLabel id={labelId} shrink>
          {label}
        </InputLabel>
        <Controller
          name={name}
          rules={mapValidationErrorMessages(rules, t)}
          render={({ field: { ref, onChange, ...fieldProps } }) => (
            <MUISelect
              {...props}
              {...fieldProps}
              error={!!error}
              label={label}
              labelId={labelId}
              autoFocus={focusOnMount}
              onChange={(e) => {
                if (onValueChange) onValueChange(e.target.value)
                onChange(e)
              }}
              inputRef={ref}
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
