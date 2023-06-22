import { InputWrapper } from '../InputWrapper'
import React from 'react'
import {
  Box,
  FormLabel,
  Switch as MUISwitch,
  type SxProps,
  Typography,
  type SwitchProps as MUISwitchProps,
} from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'
import type { ControllerProps } from 'react-hook-form/dist/types'
import { useTranslation } from 'react-i18next'
import { mapValidationErrorMessages } from '@/utils/validation.utils'
import { useGetInputAriaProps } from '@/hooks/useGetInputAriaProps'

export type RHFSwitchProps = Omit<MUISwitchProps, 'checked' | 'onChange'> & {
  label: string
  infoLabel?: string
  name: string
  vertical?: boolean
  rules?: ControllerProps['rules']
  onValueChange?: (value: boolean) => void
}

export const RHFSwitch: React.FC<RHFSwitchProps> = ({
  label,
  infoLabel,
  name,
  sx,
  vertical = false,
  rules,
  onValueChange,
  ...props
}) => {
  let formLabelSxProps: SxProps = {}
  let typographyLabelSxProps: SxProps = {}

  if (vertical) {
    formLabelSxProps = { display: 'flex', alignItems: 'center' }
    typographyLabelSxProps = { order: 2, ml: 2 }
  }

  const { formState } = useFormContext()
  const { t } = useTranslation()

  const error = formState.errors[name]?.message as string | undefined

  const {
    ids: { labelId, errorId, infoLabelId },
    inputAriaProps,
  } = useGetInputAriaProps({ label, error, infoLabel })

  return (
    <InputWrapper
      error={error}
      sx={sx}
      infoLabel={infoLabel}
      errorId={errorId}
      infoLabelId={infoLabelId}
    >
      <FormLabel sx={{ color: 'text.primary', ...formLabelSxProps }}>
        <Typography
          htmlFor={labelId}
          id={labelId}
          sx={typographyLabelSxProps}
          component="label"
          variant="body1"
        >
          {label}
        </Typography>
        <Box>
          <Controller
            name={name}
            rules={mapValidationErrorMessages(rules, t)}
            render={({ field: { value, ref, onChange, ...fieldProps } }) => (
              <MUISwitch
                {...props}
                {...fieldProps}
                inputProps={{ ...props.inputProps, ...inputAriaProps }}
                onChange={(e) => {
                  if (onValueChange) onValueChange(e.target.checked)
                  onChange(e.target.checked)
                }}
                checked={value}
                inputRef={ref}
              />
            )}
          />
        </Box>
      </FormLabel>
    </InputWrapper>
  )
}
