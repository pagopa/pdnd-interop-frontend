import React from 'react'
import { InputWrapper } from '../InputWrapper'
import { Controller, useFormContext } from 'react-hook-form'
import { type SxProps } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import it from 'date-fns/locale/it'
import en from 'date-fns/locale/en-US'
import useCurrentLanguage from '@/hooks/useCurrentLanguage'
import type { ControllerProps } from 'react-hook-form/dist/types'
import { useTranslation } from 'react-i18next'
import { mapValidationErrorMessages } from '@/utils/form.utils'

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

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={adapterLocale}>
      <InputWrapper error={error} infoLabel={infoLabel} sx={sx}>
        <Controller
          name={name}
          rules={mapValidationErrorMessages(rules, t)}
          render={({ field: { onChange, ...fieldProps } }) => (
            <DatePicker
              slotProps={{
                textField: {
                  size: 'small',
                },
              }}
              autoFocus={focusOnMount}
              sx={inputSx}
              {...fieldProps}
              onChange={(value) => {
                if (onValueChange) onValueChange(value)
                onChange(value)
              }}
              minDate={new Date()}
              disablePast
            />
          )}
        />
      </InputWrapper>
    </LocalizationProvider>
  )
}
