import React from 'react'
import {
  FormControlLabel,
  Radio,
  RadioGroup as MUIRadioGroup,
  type RadioGroupProps as MUIRadioGroupProps,
  Typography,
} from '@mui/material'
import { Controller } from 'react-hook-form'
import type { InputOption } from '@/types/common.types'
import { InputWrapper } from '@/components/shared/InputWrapper'

export type AgreementVerifiedAttributesDrawerRadioGroupProps = Omit<
  MUIRadioGroupProps,
  'onChange'
> & {
  label: string
  options: Array<InputOption & { disabled?: boolean }>
  name: string
}

export const AgreementVerifiedAttributesDrawerRadioGroup: React.FC<
  AgreementVerifiedAttributesDrawerRadioGroupProps
> = ({ sx, name, label, options, ...props }) => {
  const labelId = React.useId()

  if (!options || options.length === 0) {
    return null
  }

  return (
    <InputWrapper sx={sx}>
      <Typography variant="body2" fontWeight={600} id={labelId} component="label">
        {label}
      </Typography>
      <Controller
        name={name}
        render={({ field: { onChange, ...fieldProps } }) => (
          <MUIRadioGroup
            aria-labelledby={labelId}
            {...props}
            {...fieldProps}
            onChange={(_, value) => {
              onChange(value)
            }}
          >
            {options.map((o) => (
              <FormControlLabel
                disabled={o.disabled}
                key={o.label}
                value={o.value}
                control={<Radio />}
                label={o.label}
                sx={{ mr: 3 }}
              />
            ))}
          </MUIRadioGroup>
        )}
      />
    </InputWrapper>
  )
}
