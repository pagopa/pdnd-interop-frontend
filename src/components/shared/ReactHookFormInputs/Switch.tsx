import { InputWrapper } from '../InputWrapper'
import React from 'react'
import {
  Box,
  FormLabel,
  Switch as MUISwitch,
  SxProps,
  Typography,
  SwitchProps as MUISwitchProps,
} from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'
import { ControllerProps } from 'react-hook-form/dist/types'

type SwitchProps = Omit<MUISwitchProps, 'checked' | 'onChange'> & {
  label: string
  infoLabel?: string | JSX.Element
  name: string
  vertical?: boolean
  rules?: ControllerProps['rules']
  onValueChange?: (value: boolean) => void
}

export const Switch: React.FC<SwitchProps> = ({
  label,
  infoLabel,
  name,
  sx,
  vertical = false,
  rules,
  onValueChange,
  ...switchProps
}) => {
  let formLabelSxProps: SxProps = {}
  let typographyLabelSxProps: SxProps = {}

  if (vertical) {
    formLabelSxProps = { display: 'flex', alignItems: 'center' }
    typographyLabelSxProps = { order: 2, ml: 2 }
  }

  const { formState } = useFormContext()

  const error = formState.errors[name]?.message as string | undefined

  return (
    <InputWrapper error={error} sx={sx} infoLabel={infoLabel}>
      <FormLabel sx={{ color: 'text.primary', ...formLabelSxProps }}>
        <Typography sx={typographyLabelSxProps} component="span" variant="body1">
          {label}
        </Typography>
        <Box>
          <Controller
            name={name}
            rules={rules}
            render={({ field }) => (
              <MUISwitch
                {...switchProps}
                {...field}
                onChange={(e) => {
                  if (onValueChange) onValueChange(e.target.checked)
                  field.onChange(e.target.checked)
                }}
                checked={field.value}
              />
            )}
          />
        </Box>
      </FormLabel>
    </InputWrapper>
  )
}
