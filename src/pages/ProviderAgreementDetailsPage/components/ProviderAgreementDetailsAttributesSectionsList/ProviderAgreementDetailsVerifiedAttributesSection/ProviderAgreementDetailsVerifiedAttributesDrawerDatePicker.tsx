import React from 'react'
import { type SxProps, Typography } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import it from 'date-fns/locale/it'
import en from 'date-fns/locale/en-US'
import useCurrentLanguage from '@/hooks/useCurrentLanguage'
import { InputWrapper } from '@/components/shared/InputWrapper'

export type ProviderAgreementDetailsVerifiedAttributesDrawerDatePickerProps = {
  label: string
  sx?: SxProps
  value: Date
  onChange: (selectedDate: Date | null) => void
}

export const ProviderAgreementDetailsVerifiedAttributesDrawerDatePicker: React.FC<
  ProviderAgreementDetailsVerifiedAttributesDrawerDatePickerProps
> = ({ label, sx, value, onChange }) => {
  const lang = useCurrentLanguage()

  const adapterLocale = { it, en }[lang]

  const labelId = React.useId()

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={adapterLocale}>
      <InputWrapper sx={sx}>
        <Typography variant="label" id={labelId} component="label" mb={1.2}>
          {label}
        </Typography>
        <DatePicker
          slotProps={{
            textField: {
              size: 'small',
            },
          }}
          value={value}
          onChange={onChange}
          minDate={new Date()}
          disablePast
        />
      </InputWrapper>
    </LocalizationProvider>
  )
}
