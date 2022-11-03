import React, { ChangeEventHandler } from 'react'
import { FormLabel, Stack, Switch, SxProps, Typography } from '@mui/material'
import { StyledInputWrapper } from './StyledInputWrapper'

export type StyledRiskAnalysisSwitchProps = {
  label: string
  infoLabel?: string | JSX.Element
  name: string
  value: boolean
  error?: string
  options: Array<{
    label: string
    value: string
  }>

  onChange: ChangeEventHandler

  sx?: SxProps

  type?: 'switch'
}

export function StyledRiskAnalysisSwitch({
  label,
  infoLabel,
  name,
  value,
  error,
  options,
  sx,

  onChange,
}: StyledRiskAnalysisSwitchProps) {
  return (
    <StyledInputWrapper name={name} error={error} sx={sx} infoLabel={infoLabel}>
      <FormLabel sx={{ color: 'text.primary' }}>
        <Typography component="span" variant="body1">
          {label}
        </Typography>
        <Stack sx={{ mt: 2, mb: 1 }} direction="row" alignItems="center" spacing={0.25}>
          <Switch sx={{ ml: -1.4 }} checked={value} id={name} name={name} onChange={onChange} />
          {options.length > 0 && (
            <Typography component="span" variant="body2" fontWeight={600}>
              {options[0].label}
            </Typography>
          )}
        </Stack>
      </FormLabel>
    </StyledInputWrapper>
  )
}
