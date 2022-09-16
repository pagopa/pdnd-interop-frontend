import React, { ChangeEventHandler } from 'react'
import { Box, FormLabel, Switch, SxProps } from '@mui/material'
import { StyledInputWrapper } from './StyledInputWrapper'

export type StyledInputControlledSwitchProps = {
  label: string
  infoLabel?: string | JSX.Element
  error?: string
  value: boolean
  name: string

  onChange: ChangeEventHandler

  sx?: SxProps

  type?: 'switch'
}

export function StyledInputControlledSwitch({
  label,
  infoLabel,

  name,
  value,
  error,

  sx,

  onChange,
}: StyledInputControlledSwitchProps) {
  return (
    <StyledInputWrapper name={name} error={error} sx={sx} infoLabel={infoLabel}>
      <FormLabel sx={{ color: 'text.primary' }}>
        {label}
        <Box>
          <Switch checked={value} id={name} name={name} onChange={onChange} />
        </Box>
      </FormLabel>
    </StyledInputWrapper>
  )
}
