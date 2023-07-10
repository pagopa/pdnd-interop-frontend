import React from 'react'
import { Controller } from 'react-hook-form'
import { type SxProps, TextField, Typography } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import it from 'date-fns/locale/it'
import en from 'date-fns/locale/en-US'
import useCurrentLanguage from '@/hooks/useCurrentLanguage'
import { InputWrapper } from '@/components/shared/InputWrapper'

export type AgreementVerifiedAttributesDrawerDatePickerProps = {
  name: string
  label: string
  sx?: SxProps
}

export const AgreementVerifiedAttributesDrawerDatePicker: React.FC<
  AgreementVerifiedAttributesDrawerDatePickerProps
> = ({ name, label, sx }) => {
  const lang = useCurrentLanguage()

  const adapterLocale = { it, en }[lang]

  const labelId = React.useId()

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={adapterLocale}>
      <InputWrapper sx={sx}>
        <Typography variant="body2" fontWeight={600} id={labelId} component="label">
          {label}
        </Typography>
        <Controller
          name={name}
          render={({ field: { onChange, ...fieldProps } }) => (
            <DatePicker
              renderInput={(params) => <TextField {...params} />}
              {...fieldProps}
              onChange={(value) => {
                onChange(value)
              }}
            />
          )}
        />
      </InputWrapper>
    </LocalizationProvider>
  )
}
