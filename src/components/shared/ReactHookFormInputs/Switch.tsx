import { InputWrapper } from './InputWrapper'
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

type SwitchProps = Omit<MUISwitchProps, 'checked' | 'onChange'> & {
  label: string
  infoLabel?: string | JSX.Element
  name: string
  vertical?: boolean
}

export const Switch: React.FC<SwitchProps> = ({
  label,
  infoLabel,
  name,
  sx,
  vertical = false,
  ...switchProps
}) => {
  let formLabelSxProps: SxProps = {}
  let typographyLabelSxProps: SxProps = {}

  if (vertical) {
    formLabelSxProps = { display: 'flex', alignItems: 'center' }
    typographyLabelSxProps = { order: 2, ml: 2 }
  }

  const { control, formState } = useFormContext()

  const error = formState.errors[name]?.message as string | undefined

  return (
    <InputWrapper name={name} error={error} sx={sx} infoLabel={infoLabel}>
      <FormLabel sx={{ color: 'text.primary', ...formLabelSxProps }}>
        <Typography sx={typographyLabelSxProps} component="span" variant="body1">
          {label}
        </Typography>
        <Box>
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <MUISwitch
                {...switchProps}
                {...field}
                onChange={(e) => field.onChange(e.target.checked)}
                checked={field.value}
              />
            )}
          />
        </Box>
      </FormLabel>
    </InputWrapper>
  )
}
