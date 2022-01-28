import React, { ChangeEvent } from 'react'
import { Typography } from '@mui/material'
import { Box, SxProps } from '@mui/system'
import { StyledInputWrapper } from './StyledInputWrapper'

type StyledInputControlledFileProps = {
  name: string
  value: File | null
  error?: string
  setFieldValue(field: string, value: unknown, shouldValidate?: boolean | undefined): void
  label?: string

  infoLabel?: string

  sx?: SxProps
}

export function StyledInputControlledFileFormik({
  label,
  infoLabel,

  name,
  value,
  setFieldValue,
  error,

  sx,
}: StyledInputControlledFileProps) {
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement
    const files = target.files as FileList
    setFieldValue(name, files[0], false)
  }

  return (
    <StyledInputWrapper name={name} error={error} sx={sx} infoLabel={infoLabel}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ mr: 3, flexShrink: 0, position: 'relative' }}>
          <input
            name={name}
            type="file"
            id={name}
            style={{ position: 'absolute', width: '100%', height: '100%' }}
            onChange={onChange}
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
          <Typography component="span" variant="inherit" sx={{ fontWeight: 700 }} color="secondary">
            {value ? value.name : 'nessun file selezionato'}
          </Typography>
        </Typography>
      </Box>
    </StyledInputWrapper>
  )
}
