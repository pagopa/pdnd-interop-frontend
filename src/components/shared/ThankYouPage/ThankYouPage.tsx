import React from 'react'
import { Box, Button, Stack, Typography } from '@mui/material'
import type { SvgIconComponent } from '@mui/icons-material'

type ThankYouPageProps = {
  icon: SvgIconComponent
  title: string
  description: React.ReactNode
  buttonLabel: string
  onButtonClick: VoidFunction
}

export const ThankYouPage: React.FC<ThankYouPageProps> = ({
  icon: Icon,
  title,
  description,
  buttonLabel,
  onButtonClick,
}) => {
  return (
    <Stack justifyContent="center" alignItems="center" sx={{ height: '100%', py: 16 }}>
      <Stack
        spacing={2}
        alignItems="center"
        textAlign="center"
        sx={{ maxWidth: 560, mx: 'auto' }}
      >
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            border: '2px solid',
            borderColor: 'secondary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon sx={{ fontSize: 32, color: 'secondary.main' }} />
        </Box>
        <Typography variant="h4" component="h1" fontWeight={700}>
          {title}
        </Typography>
        <Box>{description}</Box>
        <Button variant="contained" onClick={onButtonClick} sx={{ mt: 2 }}>
          {buttonLabel}
        </Button>
      </Stack>
    </Stack>
  )
}
