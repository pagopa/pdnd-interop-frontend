import React from 'react'
import { Control, Controller, FieldValues } from 'react-hook-form'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import { Typography } from '@mui/material'
import { Box, SxProps } from '@mui/system'
import { StyledInputWrapper } from './StyledInputWrapper'

type StyledInputControlledFileProps = {
  label: string

  name: string
  control?: Control<FieldValues, Record<string, unknown>>
  rules: Record<string, unknown>
  errors: Record<string, unknown>
  infoLabel?: string
  sx?: SxProps
}

export function StyledInputControlledFile({
  label,
  control,
  rules,
  errors,
  name,
  infoLabel,
  sx,
}: StyledInputControlledFileProps) {
  const hasFieldError = Boolean(!isEmpty(errors) && !isEmpty(get(errors, name)))

  const wrapOnFieldChange =
    (callback: (files: FileList | null) => void) => (e: React.SyntheticEvent) => {
      const target = e.target as HTMLInputElement
      callback(target.files)
    }

  return (
    <StyledInputWrapper
      name={name}
      errors={errors}
      sx={sx}
      infoLabel={infoLabel}
      hasFieldError={hasFieldError}
    >
      <Controller
        shouldUnregister={true}
        name={name}
        control={control}
        rules={rules}
        render={({ field: { value, onChange, ...fieldProps } }) => (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ mr: 3, flexShrink: 0, position: 'relative' }}>
              <input
                type="file"
                id={name}
                style={{ position: 'absolute', width: '100%', height: '100%' }}
                {...fieldProps}
                onChange={wrapOnFieldChange(onChange)}
              />

              <Box
                component="label"
                htmlFor={name}
                sx={{
                  zIndex: 1,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  px: 3,
                  py: 1.5,
                  position: 'relative',
                  borderRadius: 1,
                }}
                color="common.white"
                bgcolor="primary.main"
              >
                <Typography
                  component="span"
                  variant="body2"
                  color="common.white"
                  sx={{ fontWeight: 600 }}
                >
                  {label}
                </Typography>
              </Box>
            </Box>
            <Typography component="span">
              File selezionato:{' '}
              <Typography
                component="span"
                variant="inherit"
                sx={{ fontWeight: 700 }}
                color="secondary"
              >
                {value && value[0] ? value[0].name : 'nessun file selezionato'}
              </Typography>
            </Typography>
          </Box>
        )}
      />
    </StyledInputWrapper>
  )
}
