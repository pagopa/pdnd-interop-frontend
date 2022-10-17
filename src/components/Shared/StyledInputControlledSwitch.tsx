import React, { ChangeEventHandler } from 'react'
import { Box, FormLabel, Switch, SxProps, Typography } from '@mui/material'
import { StyledInputWrapper } from './StyledInputWrapper'

export type StyledInputControlledSwitchProps = {
  label: string
  infoLabel?: string | JSX.Element
  name: string
  value: boolean
  error?: string

  vertical?: boolean
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

  vertical = false,
  sx,

  onChange,
}: StyledInputControlledSwitchProps) {
  let formLabelSxProps: SxProps = {}
  let typographyLabelSxProps: SxProps = {}

  if (vertical) {
    formLabelSxProps = { display: 'flex', alignItems: 'center' }
    typographyLabelSxProps = { order: 2, ml: 2 }
  }

  return (
    <StyledInputWrapper name={name} error={error} sx={sx} infoLabel={infoLabel}>
      <FormLabel sx={{ color: 'text.primary', ...formLabelSxProps }}>
        <Typography sx={typographyLabelSxProps} component="span" variant="body1">
          {label}
        </Typography>
        <Box>
          <Switch checked={value} id={name} name={name} onChange={onChange} />
        </Box>
      </FormLabel>
    </StyledInputWrapper>
  )
}
