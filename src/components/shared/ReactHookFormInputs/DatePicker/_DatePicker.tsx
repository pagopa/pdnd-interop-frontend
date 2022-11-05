import React from 'react'
import { InputWrapper } from '../InputWrapper'
import { Controller, useFormContext } from 'react-hook-form'
import { TextField } from '@mui/material'
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DatePickerProps } from './DatePicker'

/** Do not use. This must be lazy loaded to reduce bundle size. Use DatePicker. */
const _DatePicker: React.FC<DatePickerProps> = ({
  name,
  label,
  infoLabel,
  focusOnMount,
  sx,
  inputSx,
}) => {
  const { formState, control } = useFormContext()

  const error = formState.errors[name]?.message as string | undefined

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <InputWrapper name={name} error={error} sx={sx} infoLabel={infoLabel}>
        <Controller
          control={control}
          name={name}
          render={({ field }) => (
            <StaticDatePicker
              label={label}
              displayStaticWrapperAs="desktop"
              autoFocus={focusOnMount}
              renderInput={(params) => <TextField sx={inputSx} {...params} />}
              {...field}
            />
          )}
        />
      </InputWrapper>
    </LocalizationProvider>
  )
}

export default _DatePicker
