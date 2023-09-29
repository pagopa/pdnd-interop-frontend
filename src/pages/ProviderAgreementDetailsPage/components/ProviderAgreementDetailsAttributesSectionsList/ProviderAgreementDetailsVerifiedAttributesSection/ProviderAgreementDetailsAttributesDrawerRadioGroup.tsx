import React from 'react'
import {
  FormControlLabel,
  Radio,
  RadioGroup as MUIRadioGroup,
  type RadioGroupProps as MUIRadioGroupProps,
  Typography,
  FormControl,
} from '@mui/material'
import type { InputOption } from '@/types/common.types'
import { InputWrapper } from '@/components/shared/InputWrapper'

export type ProviderAgreementDetailsVerifiedAttributesDrawerRadioGroupProps = Omit<
  MUIRadioGroupProps,
  'onChange'
> & {
  label: string
  options: Array<InputOption & { disabled?: boolean }>
  name: string
  value: string | undefined
  onChange: (selectedValue: string) => void
}

export const ProviderAgreementDetailsVerifiedAttributesDrawerRadioGroup: React.FC<
  ProviderAgreementDetailsVerifiedAttributesDrawerRadioGroupProps
> = ({ sx, name, label, options, value, onChange, ...props }) => {
  const labelId = React.useId()

  if (!options || options.length === 0) {
    return null
  }

  return (
    <InputWrapper sx={sx}>
      <Typography variant="label" id={labelId} component="label" mb={1.2}>
        {label}
      </Typography>
      <FormControl>
        <MUIRadioGroup
          aria-labelledby={labelId}
          name={name}
          {...props}
          value={value}
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
      </FormControl>
    </InputWrapper>
  )
}
