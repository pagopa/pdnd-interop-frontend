import React, { useId } from 'react'
import { type SelectChangeEvent } from '@mui/material'
import type { MISelectOption } from '@pagopa/mui-italia'
import { MISelect, type MISelectProps } from '@pagopa/mui-italia'
import { Controller, useFormContext } from 'react-hook-form'
import type { ControllerProps } from 'react-hook-form/dist/types'
import { useTranslation } from 'react-i18next'
import { mapValidationErrorMessages } from '@/utils/form.utils'

export type RHFNewSelectProps = Omit<
  MISelectProps,
  'onChange' | 'label' | 'value' | 'options' | 'ref'
> & {
  name: string
  options: MISelectOption[]
  label?: string
  rules?: ControllerProps['rules']
  onValueChange?: (value: string | number | Array<string | number>) => void
  infoLabel?: string
}

export const RHFNewSelect: React.FC<RHFNewSelectProps> = ({
  name,
  options,
  label,
  rules,
  onValueChange,
  disabled,
  infoLabel,
  ...props
}) => {
  const { control } = useFormContext()
  const { t } = useTranslation()
  const errorId = useId()
  const infoId = useId()

  const { formState } = useFormContext()
  const errorMessage = formState.errors[name]?.message as string | undefined
  const isError = Boolean(errorMessage)
  const conditionalRules = mapValidationErrorMessages(rules, t)

  return (
    <Controller
      name={name}
      control={control}
      rules={conditionalRules}
      render={({ field: { ref, onChange, value } }) => (
        <MISelect
          {...props}
          fullWidth={props.fullWidth ?? true}
          value={value ?? (props.multiple ? [] : '')}
          id={name}
          inputRef={ref}
          helperText={infoLabel}
          label={label ?? null}
          options={options}
          onChange={(e: SelectChangeEvent<unknown>) => {
            // MISelect values come from the string or number options, or their array in multiple mode.
            const value = e.target.value as string | number | Array<string | number>
            onChange(value)
            onValueChange?.(value)
          }}
          disabled={disabled}
          error={isError || props.error}
          required={Boolean(rules?.required) || props.required}
          aria-describedby={
            [props['aria-describedby'], infoLabel && infoId, errorMessage && errorId]
              .filter(Boolean)
              .join(' ') || undefined
          }
          aria-invalid={isError}
        />
      )}
    />
  )
}
