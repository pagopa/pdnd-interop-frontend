import React from 'react'
import {
  InputLabel,
  MenuItem,
  Select as MUISelect,
  type SelectProps as MUISelectProps,
} from '@mui/material'
import { InputWrapper } from '../InputWrapper'
import { Controller, useFormContext } from 'react-hook-form'
import type { InputOption } from '@/types/common.types'
import type { ControllerProps } from 'react-hook-form/dist/types'
import { useTranslation } from 'react-i18next'
import { getAriaAccessibilityInputProps, mapValidationErrorMessages } from '@/utils/form.utils'

export type RHFSelectProps = Omit<MUISelectProps, 'onChange' | 'label'> & {
  label: string
  name: string
  options: Array<InputOption>
  focusOnMount?: boolean
  infoLabel?: string
  emptyLabel?: string
  rules?: ControllerProps['rules']
  onValueChange?: (value: string) => void
}

export const RHFSelect: React.FC<RHFSelectProps> = ({
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
  const { t } = useTranslation()

  const error = formState.errors[name]?.message as string | undefined

  const { accessibilityProps, ids } = getAriaAccessibilityInputProps(name, {
    label,
    infoLabel,
    error,
  })

  return (
    <InputWrapper error={error} sx={sx} infoLabel={infoLabel} {...ids}>
      <InputLabel id={ids.labelId} shrink>
        {label}
      </InputLabel>
      <Controller
        name={name}
        rules={mapValidationErrorMessages(rules, t)}
        render={({ field: { ref, onChange, ...fieldProps } }) => (
          <MUISelect
            {...props}
            {...fieldProps}
            inputProps={{
              ...props.inputProps,
              'aria-describedby': accessibilityProps['aria-describedby'],
            }}
            label={label}
            labelId={ids.labelId}
            error={!!error}
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
    </InputWrapper>
  )
}
