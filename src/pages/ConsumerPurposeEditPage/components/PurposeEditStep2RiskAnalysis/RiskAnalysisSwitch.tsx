import React from 'react'
import {
  FormLabel,
  Switch as MUISwitch,
  Typography,
  SwitchProps as MUISwitchProps,
  Stack,
} from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'
import { InputWrapper } from '@/components/shared/InputWrapper'
import { InputOption } from '@/types/common.types'

type RiskAnalysisSwitchProps = Omit<MUISwitchProps, 'checked' | 'onChange'> & {
  label: string
  infoLabel?: string | JSX.Element
  options: Array<InputOption>
  name: string
}

export const RiskAnalysisSwitch: React.FC<RiskAnalysisSwitchProps> = ({
  label,
  infoLabel,
  options,
  name,
  sx,
  ...switchProps
}) => {
  const { control, formState } = useFormContext()

  const error = formState.errors[name]?.message as string | undefined

  return (
    <InputWrapper error={error} sx={sx} infoLabel={infoLabel}>
      <FormLabel sx={{ color: 'text.primary' }}>
        <Typography component="span" variant="body1">
          {label}
        </Typography>
        <Stack sx={{ mt: 2, mb: 1 }} direction="row" alignItems="center" spacing={0.25}>
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
          {options.length > 0 && (
            <Typography component="span" variant="body2" fontWeight={600}>
              {options[0].label}
            </Typography>
          )}
        </Stack>
      </FormLabel>
    </InputWrapper>
  )
}
