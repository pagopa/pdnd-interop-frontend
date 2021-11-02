import React from 'react'
import { Input, FormControl, FormLabel, InputBaseComponentProps, Typography } from '@mui/material'
import { InfoTooltip } from './InfoTooltip'

export type StyledInputTextType = 'text' | 'email' | 'number'

type StyledInputTextProps = {
  type?: StyledInputTextType
  id: string
  label: string
  placeholder?: string
  readOnly?: boolean
  value?: string | number
  onChange?: any
  tooltipLabel?: string
  inputProps?: InputBaseComponentProps
}

export function StyledInputText({
  type = 'text',
  id,
  label,
  placeholder = 'Lorem ipsum',
  readOnly = false,
  value,
  onChange,
  tooltipLabel,
  inputProps,
}: StyledInputTextProps) {
  return (
    <FormControl component="fieldset" sx={{ display: 'block' }}>
      <FormLabel component="legend" sx={{ mb: '0.5rem' }}>
        <Typography component="span" sx={{ fontWeight: 600, px: '0.5rem' }}>
          {label}
        </Typography>{' '}
        {tooltipLabel && <InfoTooltip label={tooltipLabel} />}
      </FormLabel>

      <Input
        sx={{ px: '0.5rem', py: '0.5rem' }}
        fullWidth
        id={id}
        disabled={readOnly}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        value={value}
        inputProps={inputProps}
      />
    </FormControl>
  )
}
