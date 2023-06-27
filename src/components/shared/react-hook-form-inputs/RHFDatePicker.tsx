import React from 'react'
import { InputWrapper } from '../InputWrapper'
import { Controller, useFormContext } from 'react-hook-form'
import { type SxProps, TextField } from '@mui/material'
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import it from 'date-fns/locale/it'
import en from 'date-fns/locale/en-US'
import useCurrentLanguage from '@/hooks/useCurrentLanguage'
import type { ControllerProps } from 'react-hook-form/dist/types'
import { useTranslation } from 'react-i18next'
import { getAriaAccessibilityInputProps, mapValidationErrorMessages } from '@/utils/form.utils'

export type RHFDatePickerProps = {
  name: string
  label?: string
  disabled?: boolean
  infoLabel?: string
  focusOnMount?: boolean
  sx?: SxProps
  inputSx?: SxProps
  rules?: ControllerProps['rules']
  onValueChange?: (value: Date) => void
}

export const RHFDatePicker: React.FC<RHFDatePickerProps> = ({
  name,
  label,
  infoLabel,
  focusOnMount,
  sx,
  inputSx,
  rules,
  onValueChange,
}) => {
  const { formState } = useFormContext()
  const lang = useCurrentLanguage()
  const { t } = useTranslation()

  const error = formState.errors[name]?.message as string | undefined
  const adapterLocale = { it, en }[lang]

  const { accessibilityProps, ids } = getAriaAccessibilityInputProps(name, {
    label,
    infoLabel,
    error,
  })

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={adapterLocale}>
      <InputWrapper error={error} infoLabel={infoLabel} sx={sx} {...ids}>
        <Controller
          name={name}
          rules={mapValidationErrorMessages(rules, t)}
          render={({ field: { onChange, ...fieldProps } }) => (
            <StaticDatePicker
              label={label}
              displayStaticWrapperAs="desktop"
              autoFocus={focusOnMount}
              renderInput={(params) => (
                <TextField sx={inputSx} {...params} inputProps={accessibilityProps} />
              )}
              {...fieldProps}
              onChange={(value) => {
                if (onValueChange) onValueChange(value)
                onChange(value)
              }}
            />
          )}
        />
      </InputWrapper>
    </LocalizationProvider>
  )
}
