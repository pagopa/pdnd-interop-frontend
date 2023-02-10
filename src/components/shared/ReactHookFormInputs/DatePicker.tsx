import React from 'react'
import { InputWrapper } from '../InputWrapper'
import { Controller, useFormContext } from 'react-hook-form'
import { SxProps, TextField } from '@mui/material'
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import it from 'date-fns/locale/it'
import en from 'date-fns/locale/en-US'
import useCurrentLanguage from '@/hooks/useCurrentLanguage'
import { ControllerProps } from 'react-hook-form/dist/types'

type DatePickerProps = {
  name: string
  label?: string
  disabled?: boolean
  infoLabel?: string | JSX.Element
  focusOnMount?: boolean
  sx?: SxProps
  inputSx?: SxProps
  rules?: ControllerProps['rules']
  onValueChange?: (value: Date) => void
}

export const DatePicker: React.FC<DatePickerProps> = ({
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

  const error = formState.errors[name]?.message as string | undefined

  const adapterLocale = { it, en }[lang]

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={adapterLocale}>
      <InputWrapper error={error} sx={sx} infoLabel={infoLabel}>
        <Controller
          name={name}
          rules={rules}
          render={({ field }) => (
            <StaticDatePicker
              label={label}
              displayStaticWrapperAs="desktop"
              autoFocus={focusOnMount}
              renderInput={(params) => <TextField sx={inputSx} {...params} />}
              {...field}
              onChange={(value) => {
                if (onValueChange) onValueChange(value)
                field.onChange(value)
              }}
            />
          )}
        />
      </InputWrapper>
    </LocalizationProvider>
  )
}
