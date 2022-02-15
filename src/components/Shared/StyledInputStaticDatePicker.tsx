import React, { FunctionComponent } from 'react'
import { StaticDatePicker } from '@mui/lab'
import { SxProps } from '@mui/system'
import { StyledInputWrapper } from './StyledInputWrapper'
import { TextField } from '@mui/material'
import { FormikSetFieldValue } from '../../../types'

type StyledInputStaticDatePickerProps = {
  name: string
  error?: string
  setFieldValue: FormikSetFieldValue
  label?: string

  disabled?: boolean
  infoLabel?: string
  value?: Date

  focusOnMount?: boolean
  sx?: SxProps
  inputSx?: SxProps
}

export const StyledInputStaticDatePicker: FunctionComponent<StyledInputStaticDatePickerProps> = ({
  label,
  disabled = false,
  infoLabel,

  name,
  value,
  setFieldValue,
  error,

  focusOnMount = false,
  sx,
  inputSx,
}) => {
  const onChange = (newDate: Date | null) => {
    setFieldValue(name, newDate, false)
  }

  return (
    <StyledInputWrapper name={name} error={error} sx={sx} infoLabel={infoLabel}>
      <StaticDatePicker
        label={label}
        displayStaticWrapperAs="desktop"
        onChange={onChange}
        value={value}
        autoFocus={focusOnMount}
        disabled={disabled}
        renderInput={(params) => <TextField sx={inputSx} {...params} />}
      />
    </StyledInputWrapper>
  )
}
