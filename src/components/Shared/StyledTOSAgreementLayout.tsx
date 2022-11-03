import React from 'react'
import { Stack, Typography, Box, Button } from '@mui/material'
import { SxProps } from '@mui/system'

type StyledTOSAgreementLayoutProps = {
  productName: string
  description: React.ReactNode | string
  children?: React.ReactNode
  onConfirm: VoidFunction

  sx?: SxProps
  confirmBtnDisabled?: boolean
  confirmBtnLabel?: string
}

export function StyledTOSAgreementLayout({
  productName,
  description,
  children,
  onConfirm,

  sx,
  confirmBtnDisabled,
  confirmBtnLabel = 'Accedi',
}: StyledTOSAgreementLayoutProps) {
  const isDescriptionComponentAString = typeof description === 'string'

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{ py: 16, backgroundColor: 'background.default', ...sx }}
    >
      <Stack sx={{ textAlign: 'center', maxWidth: 720, mx: 'auto', px: 4 }} spacing={8}>
        <Stack spacing={1}>
          <Typography variant="h3">{productName}</Typography>
          <Typography component={isDescriptionComponentAString ? 'p' : 'span'}>
            {description}
          </Typography>
        </Stack>
        {children && <Box>{children}</Box>}
        <Box>
          <Button onClick={onConfirm} variant="contained" disabled={confirmBtnDisabled}>
            {confirmBtnLabel}
          </Button>
        </Box>
      </Stack>
    </Stack>
  )
}
